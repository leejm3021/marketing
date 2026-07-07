import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Gemini API Client initialization
function getGeminiClient(customApiKey?: string): GoogleGenAI {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY가 없습니다. 랜딩 페이지 상단에서 API Key를 직접 입력하시거나 비밀번호/환경변수로 설정해주세요.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API endpoint to validate custom API Key
app.post("/api/validate-key", async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey) {
      return res.status(400).json({ error: "API Key가 전달되지 않았습니다." });
    }
    const ai = new GoogleGenAI({ apiKey });
    // Try a simple call to verify the key using gemini-3.5-flash
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "OK",
    });
    if (response && response.text) {
      return res.json({ success: true });
    } else {
      return res.status(400).json({ error: "유효하지 않은 API Key 반응입니다." });
    }
  } catch (error: any) {
    // Return a clean, user-friendly message without raw Google API error payload and do NOT log the raw error structure to the console.
    return res.status(400).json({ error: "입력하신 API Key가 유효하지 않습니다. Google AI Studio에서 올바른 키를 다시 발급받아 입력해주세요." });
  }
});

// API endpoint to generate marketing plan
app.post("/api/generate-plan", async (req, res) => {
  try {
    const answers = req.body;
    
    // Check missing answers
    if (!answers) {
      return res.status(400).json({ error: "No campaign data provided" });
    }

    const headerKey = req.headers["x-gemini-api-key"] as string;
    const bodyKey = answers.customApiKey;
    const customApiKey = headerKey || bodyKey;

    const {
      step0, // Campaign goal
      step1, // Genre
      step2, // Platform
      step3, // Target Audience
      step4, // Series Stage
      step5, // Tone & Manner
      step6, // Synopsis, keywords, comparison
      step7, // Channels (array of string)
      step8, // Weekday
      step9, // Promotion schedule
    } = answers;

    const channelsText = Array.isArray(step7) ? step7.join(", ") : step7 || "미지정";

    // System instruction and user prompt to guarantee strict adherence to format & guidelines
    const systemInstruction = `너는 웹툰 및 웹소설 IP(지식재산권) 산업에 특화된 10년 차 수석 콘텐츠 마케터이자, 세계 최고 수준의 프롬프트 엔지니어다.
사용자가 단계별 질문을 통해 입력한 마케팅 정보를 바탕으로 실무에서 바로 사용할 수 있는 최상의 마케팅 제안서(기획안)를 작성하라.

반드시 다음 제약 사항과 가이드라인을 엄격히 준수하라:
1. 할루시네이션 금지: 사용자가 입력한 스토리 설정(캐릭터명, 서사 전개 등)이나 비교작 외에, 사용자가 제공하지 않은 이야기를 임의로 지어내어 사실처럼 서술하지 말 것. 정보가 없거나 부족한 부분은 주어진 키워드 범위 내에서만 창작하고, 필요 시 "~에 대한 정보가 없어 일반적인 표현으로 작성했습니다"라고 명시하라.
2. 지정한 채널 외 출력 금지: 사용자가 선택한 마케팅 채널(${channelsText})에 대해서만 Output Format의 해당 채널 섹션을 생성하라. 선택하지 않은 채널은 절대 본문에 포함시키지 말라.
3. 캠페인 목표(${step0})와 연재 단계(${step4})를 제안서 전반에 걸쳐 일관성 있게 반영하라.
4. 비교 작품(${step6})이 언급된 경우, 경쟁작 대비 차별화 포인트 섹션에 "~와 달리 본작은 ~" 형태로 차별성을 구체적으로 명시하라. 만약 비교작품이 없다면 해당 문맥 하에 장르적 특성과 차별점을 서술하라.
5. 주간 캘린더에는 사용자가 입력한 연재 요일(${step8})과 프로모션 일정(${step9})이 실제로 어떻게 반영되는지 상세히 노출하라.
6. 인스타그램 카드뉴스, 숏폼/롱폼 대본 등은 구체적인 비주얼 묘사, 시간대별 타임라인, 구체적 동사 위주의 자막 및 연출 힌트를 세밀하게 명시하라.
7. 업계 실무 전문 용어(로판, 회빙환, 사이다물, 인방물, 완결 정주행 등)를 매끄럽고 신뢰감 있게 활용하라.`;

    const userPrompt = `다음 입력 데이터를 기반으로 고품질의 IP 마케팅 기획안을 작성해줘:

[입력 데이터]
- 캠페인 목표 (Step 0): ${step0}
- 작품 장르 (Step 1): ${step1}
- 연재 플랫폼 (Step 2): ${step2}
- 핵심 타겟 독자층 (Step 3): ${step3}
- 연재 진행 단계 (Step 4): ${step4}
- 톤앤매너 및 브랜드 보이스 (Step 5): ${step5}
- 시놉시스 및 핵심 키워드/비교작품 (Step 6): ${step6}
- 마케팅 채널 선택 (Step 7): ${channelsText}
- 연재 요일 (Step 8): ${step8}
- 프로모션 및 이벤트 일정 (Step 9): ${step9}

반드시 아래 포맷에 맞춰 출력하되, 선택된 채널(${channelsText})에 해당하는 하위 섹션만 생성해라:

## 1. 작품 핵심 셀링 포인트 (3~5개)
- [셀링 포인트 제목]: [타겟 소구점 + 캠페인 목표 반영 상세 설명]

## 2. 경쟁작 대비 차별화 포인트
- (Step 6 비교작 기반 "~와 달리 본작은 ~" 형태 명시)

## 3. 주간 콘텐츠 캘린더 (월~일)
- **[요일]** / [채널명] / [콘텐츠 주제] / [반영된 마케팅 이슈 또는 이벤트]
(월요일부터 일요일까지 빠짐없이 7일을 작성하고, 연재 요일과 프로모션 일정을 실제 반영할 것)

## 4. 채널별 콘텐츠 상세 초안
(선택한 채널만 생성할 것. 선택하지 않은 채널은 절대 노출 금지)

${step7.includes("인스타그램 카드뉴스") ? `### [인스타그램 카드뉴스 카피]
- **이미지별 텍스트 가이드**: (1페이지 타이틀, 페이지별 핵심 요약 문구)
- **본문 카피**: (300자 이내, 가독성 높은 줄바꿈)
- **추천 해시태그**: (5~7개, 플랫폼/장르 SEO 키워드 포함)
` : ""}

${step7.includes("틱톡/유튜브 쇼츠") ? `### [틱톡/유튜브 쇼츠 숏폼 대본]
- **영상 컨셉**: 
- **오프닝 훅 (0~3초)**: (이탈 방지용 후킹 멘트 및 자막 연출)
- **본문 내용 (3~50초)**: (초 단위 타임라인 + 화면 연출 힌트, 구체적 동사 위주)
- **클로징 및 CTA (50~60초)**: (행동 유도 문구)
` : ""}

${step7.includes("유튜브 롱폼") ? `### [유튜브 롱폼 기획안]
- **영상 컨셉 및 예상 러닝타임**:
- **챕터별 구성**: (인트로 / 본편 / 아웃트로 타임라인)
- **썸네일 문구 제안**: 2~3안
` : ""}

${step7.includes("X(트위터)") ? `### [X(트위터) 스레드/포스트]
- **포스트 카피**: (140자 내외, 짧고 임팩트 있는 문장)
- **추천 해시태그 및 밈 요소**:
` : ""}

${step7.includes("블로그(SEO)") ? `### [블로그/SEO 포스트]
- **제목(SEO 키워드 포함)**:
- **목차 구성**:
- **핵심 문단 요약**: (3~5개 소제목별 요약, 전문 인용 없이 자체 작성)
` : ""}

${step7.includes("카카오톡 채널") || step7.includes("커뮤니티(디시/에펨코리아 등)") ? `### [카카오톡 채널/커뮤니티용 짧은 공지형 카피]
- **공지 카피**: (100자 내외, 클릭 유도형)
` : ""}

## 5. 성과 측정 제안
- 각 채널별로 확인하면 좋은 핵심 지표 (저장수/공유수, 완주율, 프로필 클릭률, 유입 전환율 등) 1~2개씩 구체적으로 제안`;

    const ai = getGeminiClient(customApiKey);
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ plan: result.text });
  } catch (error: any) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Vite middleware configuration for full-stack integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
