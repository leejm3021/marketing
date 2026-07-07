import React, { useState, useEffect } from "react";
import { AppState, SurveyAnswers, StepKey, Option } from "./types";
import { STEPS } from "./data";
import StepTimeline from "./components/StepTimeline";
import LiveSummarySidebar from "./components/LiveSummarySidebar";
import ProposalViewer from "./components/ProposalViewer";
import { 
  Target, BookOpen, Smartphone, Users, Sparkles, TrendingUp, 
  Megaphone, Calendar, Gift, FileText, ArrowRight, ArrowLeft, 
  RefreshCw, ClipboardCheck, AlertCircle, Sparkle, BadgeAlert, 
  ShieldCheck, Loader2, ThumbsUp, Flame, Heart, Check, Eye, EyeOff
} from "lucide-react";

export default function App() {
  const [appState, setAppState] = useState<AppState>("intro");
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [highestStepReached, setHighestStepReached] = useState<number>(0);

  // Gemini API Key management states
  const [customApiKey, setCustomApiKeyState] = useState<string>(() => {
    return localStorage.getItem("gemini_api_key") || "";
  });
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationStatus, setValidationStatus] = useState<"idle" | "success" | "error">(
    localStorage.getItem("gemini_api_key") ? "success" : "idle"
  );
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [showKey, setShowKey] = useState<boolean>(false);

  const handleSaveAndValidateKey = async (key: string) => {
    const trimmedKey = key.trim();
    if (!trimmedKey) {
      localStorage.removeItem("gemini_api_key");
      setCustomApiKeyState("");
      setValidationStatus("idle");
      setValidationMessage("");
      return;
    }

    setIsValidating(true);
    setValidationMessage("");
    try {
      const response = await fetch("/api/validate-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey: trimmedKey }),
      });

      let data: any = {};
      const rawText = await response.text();
      try {
        data = JSON.parse(rawText);
      } catch (parseErr) {
        console.error("API response parsing failed:", parseErr, rawText);
        data = { error: `서버 응답 해석 실패 (HTTP 상태코드 ${response.status})` };
      }

      if (response.ok && data.success) {
        localStorage.setItem("gemini_api_key", trimmedKey);
        setCustomApiKeyState(trimmedKey);
        setValidationStatus("success");
        setValidationMessage("API Key가 성공적으로 검증 및 저장되었습니다!");
      } else {
        setValidationStatus("error");
        setValidationMessage(data.error || "API Key가 유효하지 않습니다. 확인 후 다시 입력해주세요.");
      }
    } catch (err: any) {
      console.error("API Key Validation network/fetch error:", err);
      setValidationStatus("error");
      setValidationMessage(`서버 통신 오류가 발생했습니다: ${err.message || "연결 실패"}. 잠시 후 다시 시도해주세요.`);
    } finally {
      setIsValidating(false);
    }
  };
  
  // Initialize survey answers
  const [answers, setAnswers] = useState<SurveyAnswers>({
    step0: "",
    step1: "",
    step2: "",
    step3: "",
    step4: "",
    step5: "",
    step6: "",
    step7: [],
    step8: "",
    step9: "",
  });

  // Current step state
  const [customInputValue, setCustomInputValue] = useState<string>("");
  const [selectedMultipleOptions, setSelectedMultipleOptions] = useState<string[]>([]);
  const [reactionText, setReactionText] = useState<string>("");
  const [showReaction, setShowReaction] = useState<boolean>(false);
  
  // Loading status messages
  const [loadingMessageIdx, setLoadingMessageIdx] = useState<number>(0);
  const [errorText, setErrorText] = useState<string>("");
  const [generatedPlan, setGeneratedPlan] = useState<string>("");

  // Landing page interactive sandbox states
  const [demoGenre, setDemoGenre] = useState<string>("로맨스 판타지");
  const [demoTarget, setDemoTarget] = useState<string>("20대 여성");

  const getDemoSample = (genre: string, target: string) => {
    let keywords: string[] = ["#독점작", "#사이다전개"];
    let tagline = "천만 독자가 열광한 전설적인 웹툰, 지금 바로 감상해보세요.";
    let channels: string[] = ["인스타그램 카드뉴스", "트위터(X) 트렌드"];
    let benefitText = "구독자 유입 140% 향상 예상";

    if (genre === "로맨스 판타지") {
      keywords = ["#구원서사", "#회빙환", "#집착남주", "#여주중심"];
      if (target === "20대 여성") {
        tagline = "여주를 죽인 그의 뺨을 갈겼다. 그가 내 무릎 아래 꿇고 애원하기 전까지는.";
        channels = ["인스타그램 릴스", "트위터(X) 주접글"];
        benefitText = "20대 여성 독자의 과몰입 유발 240% 극대화";
      } else if (target === "10대 남성") {
        tagline = "설마 내 약혼자가... 마왕의 딸?! 아카데미 최고의 천재가 살아남는 법!";
        channels = ["유튜브 쇼츠", "네이버 웹툰 덧글"];
        benefitText = "급상승 랭킹 진입 확률 대폭 상승";
      } else if (target === "30대 남성") {
        tagline = "아내가 집착한다. 그런데 그녀가 제국 최강의 용사라니?! 귀농 영주의 눈물겨운 이중생활.";
        channels = ["카카오페이지 배너", "남초 커뮤니티"];
        benefitText = "구매 전환율(ROAS) 180% 상승 타겟팅";
      } else {
        tagline = "다시 눈을 뜨니 제국 최고의 거부, 공작가의 안주인이 되었다. 이번 생은 다 가질 거야.";
        channels = ["카카오스토리 광고", "블로그 서평"];
        benefitText = "소장권 충전 적극 유도형 문구";
      }
    } else if (genre === "현대 판타지") {
      keywords = ["#사이다물", "#먼치킨", "#시스템창", "#랭커"];
      if (target === "20대 여성") {
        tagline = "지하철 4호선이 던전이 되었다. 내 유일한 가이드는... 이 무뚝뚝한 S급 헌터뿐?!";
        channels = ["트위터(X) 일러스트", "인스타그램"];
        benefitText = "로맨스 가이드물 독자층 크로스오버 유입";
      } else if (target === "10대 남성") {
        tagline = "레벨 1부터 신들을 지배하다. 전직 프로게이머의 압도적인 아카데미 지배 랭킹!";
        channels = ["틱톡 쇼츠", "유튜브 게임툰"];
        benefitText = "초반 랭킹 지표 300% 급상승 타겟팅";
      } else if (target === "30대 남성") {
        tagline = "퇴사하고 헌터가 되었다. 30년 차 부장님이 전설의 보스로 각성하여 빌딩 매입하는 법!";
        channels = ["남초 커뮤니티(디시)", "유튜브 Shorts"];
        benefitText = "구매력이 높은 남성 독자층 완벽 저격";
      } else {
        tagline = "헌터 협회 회장이 내 아들?! 만년 F급 아빠가 S급 던전 보스를 요리하는 꿀팁.";
        channels = ["네이버 밴드", "카카오톡 채널"];
        benefitText = "친근한 가족 서사로 중장년 유입 최적화";
      }
    } else if (genre === "무협/퓨전") {
      keywords = ["#화산파", "#환생", "#절대강자", "#남궁세가"];
      if (target === "20대 여성") {
        tagline = "남궁세가의 시한부 막내딸이 되었다. 천하제일인 화산파 장문인이 나를 둥기둥기 보살핀다?!";
        channels = ["트위터(X) 2차 창작", "인스타그램"];
        benefitText = "무협 로맨스 특화 여성 매니아층 포섭";
      } else if (target === "10대 남성") {
        tagline = "마교 교주가 아카데미 낙제생으로 환생했다! 초고속 화산 검법으로 학교 일진들 제압하기!";
        channels = ["유튜브 Shorts", "웹툰 댓글 밈"];
        benefitText = "10대 학원 액션 선호 독자 급증 예상";
      } else if (target === "30대 남성") {
        tagline = "천하를 이미 얻어봤다. 구태여 싸우고 싶지 않거늘, 왜 자꾸 건드리는가. 평범한 객잔 주인의 각성.";
        channels = ["무협 커뮤니티", "네이버 시리즈 배너"];
        benefitText = "전통 무협 매니아 및 정통 독자 충성도 210% 확보";
      } else {
        tagline = "가문의 부흥은 내 검 끝에서 시작된다. 다시 태어난 남궁세가 가주의 무림 평정 대서사시.";
        channels = ["카카오페이지 소장권 알림", "밴드 무협 소모임"];
        benefitText = "40대 정통 장르 소비층 소장 유도";
      }
    } else {
      keywords = ["#청춘물", "#스포츠천재", "#학원성장", "#우정"];
      if (target === "20대 여성") {
        tagline = "농구부 주장과 만년 벤치 매니저의 청량 지수 100% 한 여름밤 아지랑이 같은 로맨스.";
        channels = ["트위터(X) 주접 트윗", "인스타그램 릴스"];
        benefitText = "청량 하이틴 감성 바이럴 바이패스 확보";
      } else if (target === "10대 남성") {
        tagline = "재능 최하위 만년 벤치 멤버의 기적적인 하이큐급 필살기! 전국 대회 30초 전 대역전극!";
        channels = ["틱톡 챌린지", "유튜브 쇼츠"];
        benefitText = "10대 청소년 스포츠/학원 유입 최적화";
      } else if (target === "30대 남성") {
        tagline = "9회말 2아웃, 전설의 투수가 고교 시절로 환생했다. 다시 쓰는 메이저리그 신화!";
        channels = ["야구 커뮤니티(엠엘비)", "시리즈 푸시"];
        benefitText = "30대 직장인 스포츠 독자 회빙환 코드 자극";
      } else {
        tagline = "내 아이가 전국체전 메달리스트?! 헌신적인 부모와 천재 양궁 소녀의 눈물겨운 올림픽 도전기.";
        channels = ["페이스북 추천페이지", "카카오 밴드"];
        benefitText = "가슴 뭉클한 감동 스토리 독자층 수집";
      }
    }

    return { keywords, tagline, channels, benefitText };
  };

  const loadingMessages = [
    "IP 마케팅 수석 기획자가 제안서를 초안하는 중입니다...",
    "선택하신 SNS 채널에 특화된 카피를 설계하고 있습니다...",
    "주간 콘텐츠 캘린더 일정을 조율하고 있습니다...",
    "경쟁 분석 및 핵심 성과 지표(KPI)를 분석하고 있습니다...",
    "세계 최고 수준의 프롬프트를 조율하여 카피를 완성하는 중입니다...",
  ];

  // Rotate loading messages
  useEffect(() => {
    let interval: any;
    if (appState === "generating") {
      interval = setInterval(() => {
        setLoadingMessageIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [appState]);

  const currentStep = STEPS[currentStepIdx];

  // Map icon strings to Lucide components
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case "Target": return <Target className="h-6 w-6 text-indigo-600 shrink-0" />;
      case "BookOpen": return <BookOpen className="h-6 w-6 text-pink-500 shrink-0" />;
      case "Smartphone": return <Smartphone className="h-6 w-6 text-blue-500 shrink-0" />;
      case "Users": return <Users className="h-6 w-6 text-purple-500 shrink-0" />;
      case "TrendingUp": return <TrendingUp className="h-6 w-6 text-emerald-500 shrink-0" />;
      case "Sparkles": return <Sparkles className="h-6 w-6 text-amber-500 shrink-0" />;
      case "FileText": return <FileText className="h-6 w-6 text-orange-500 shrink-0" />;
      case "Megaphone": return <Megaphone className="h-6 w-6 text-cyan-500 shrink-0" />;
      case "Calendar": return <Calendar className="h-6 w-6 text-teal-500 shrink-0" />;
      case "Gift": return <Gift className="h-6 w-6 text-red-500 shrink-0" />;
      default: return <Sparkles className="h-6 w-6 text-slate-500 shrink-0" />;
    }
  };

  // Sync state when moving between questions
  useEffect(() => {
    if (appState === "survey") {
      const savedAns = answers[currentStep.key];
      if (currentStep.type === "multiple") {
        setSelectedMultipleOptions(Array.isArray(savedAns) ? savedAns : []);
        setCustomInputValue("");
      } else if (currentStep.type === "text") {
        setCustomInputValue(typeof savedAns === "string" ? savedAns : "");
      } else {
        // Single choice
        const isPreset = currentStep.options.some(opt => opt.label === savedAns && !opt.isCustom);
        if (savedAns && !isPreset) {
          // It's a custom value
          setCustomInputValue(savedAns);
        } else {
          setCustomInputValue("");
        }
      }
      setShowReaction(false);
      setReactionText("");
    }
  }, [currentStepIdx, appState]);

  // Handle choice selection for Single Choice Step
  const handleSingleSelect = (option: Option) => {
    if (option.isCustom) {
      // Prompt user for custom input instead of advancing immediately
      setCustomInputValue("");
      // Update answers with a placeholder or empty until they write
      setAnswers(prev => ({ ...prev, [currentStep.key]: "" }));
      return;
    }

    const value = option.label;
    
    // Set Marketer's 1-sentence response (Reaction Requirement A-2)
    const reaction = `"${value}" 장르 및 타겟 요소를 정확히 반영하여 최상의 계획을 수립하겠습니다!`;
    setReactionText(reaction);
    setShowReaction(true);

    setAnswers(prev => ({ ...prev, [currentStep.key]: value }));

    // Auto-advance after 1.5s so they can read the reaction
    setTimeout(() => {
      advanceStep();
    }, 1200);
  };

  // Handle multi-select checkboxes
  const handleMultipleSelectToggle = (option: Option) => {
    let updated: string[];
    if (selectedMultipleOptions.includes(option.label)) {
      updated = selectedMultipleOptions.filter(item => item !== option.label);
    } else {
      updated = [...selectedMultipleOptions, option.label];
    }
    setSelectedMultipleOptions(updated);
    setAnswers(prev => ({ ...prev, [currentStep.key]: updated }));
  };

  // Save text or custom input
  const handleCustomSubmit = () => {
    if (!customInputValue.trim()) return;

    const value = customInputValue.trim();
    
    let updatedAnswers = { ...answers };
    if (currentStep.type === "multiple") {
      const updated = [...selectedMultipleOptions, value];
      setSelectedMultipleOptions(updated);
      updatedAnswers[currentStep.key] = updated;
    } else {
      updatedAnswers[currentStep.key] = value;
    }

    setAnswers(updatedAnswers);

    const reaction = `직접 입력해주신 "${value}" 설정을 기획안에 100% 반영하겠습니다!`;
    setReactionText(reaction);
    setShowReaction(true);

    setTimeout(() => {
      advanceStep();
    }, 1200);
  };

  const advanceStep = () => {
    if (currentStepIdx < STEPS.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      if (nextIdx > highestStepReached) {
        setHighestStepReached(nextIdx);
      }
    } else {
      // Go to Summary Screen
      setAppState("summary");
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    } else {
      setAppState("intro");
    }
  };

  // Allow jump back to any step (Requirement A-5)
  const handleStepJump = (idx: number) => {
    setCurrentStepIdx(idx);
    setShowReaction(false);
  };

  // Generate exact 5-line summary for user confirmation (Requirement C)
  const generateFiveLineSummary = () => {
    return [
      `1. [KPI 목표]: ${answers.step0}`,
      `2. [장르 및 유통처]: ${answers.step1} (${answers.step2})`,
      `3. [핵심 타겟 독자]: ${answers.step3} (${answers.step4})`,
      `4. [기획 채널]: ${answers.step7.join(", ")} (${answers.step8} 연재)`,
      `5. [프로모션 혜택]: ${answers.step9 || "별도 예정 프로모션 없음"}`,
    ];
  };

  // Call Express API to invoke Gemini and return plan
  const handleConfirmAndGenerate = async () => {
    setAppState("generating");
    setErrorText("");
    
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (customApiKey) {
        headers["x-gemini-api-key"] = customApiKey;
      }

      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers,
        body: JSON.stringify({ ...answers, customApiKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "제안서 생성 도중 오류가 발생했습니다.");
      }

      const data = await response.json();
      setGeneratedPlan(data.plan);
      setAppState("result");
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "연결 상태가 올바르지 않거나 API 오류가 발생했습니다. 다시 시도해 주세요.");
      setAppState("summary");
    }
  };

  const startSurvey = () => {
    if (validationStatus !== "success") {
      const element = document.getElementById("api-key-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        const card = element.querySelector(".liquid-glass");
        if (card) {
          card.classList.add("ring-4", "ring-rose-500/50");
          setTimeout(() => {
            card.classList.remove("ring-4", "ring-rose-500/50");
          }, 3000);
        }
      }
      setValidationStatus("error");
      setValidationMessage("⚠️ 서비스를 이용하려면 먼저 아래에서 Gemini API Key를 등록하고 승인받아야 합니다.");
      return;
    }
    setAppState("survey");
    setCurrentStepIdx(0);
    setHighestStepReached(0);
  };

  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-indigo-100 relative">
      <div className="ambient-bg" />
      
      {/* Universal Top Branding Header */}
      <header className="liquid-glass border-b border-white/50 py-3.5 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-mono font-bold text-sm tracking-tighter shadow-md">
              IP
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-extrabold text-sm text-slate-900 tracking-tight">IP 마케팅 솔루션</span>
                <span className="bg-indigo-50/80 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-indigo-100/60">PRO v1.2</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">10년 차 수석 마케터의 Sequential Prompting 시스템</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {customApiKey && validationStatus === "success" ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-500/20">
                <Sparkles className="h-3 w-3 text-emerald-600" />
                Gemini 연동 활성화
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-800 text-[10px] font-bold rounded-full border border-amber-500/20">
                <BadgeAlert className="h-3 w-3 text-amber-600" />
                기본 서버 인프라 사용
              </span>
            )}
            <div className="hidden md:flex items-center gap-1 text-[10px] text-slate-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SERVER: ONLINE</span>
            </div>
          </div>
        </div>
      </header>

      {/* INTRO APP STATE */}
      {appState === "intro" && (
        <main className="max-w-5xl mx-auto px-4 py-12 md:py-16 space-y-20">
          
          {/* HERO SECTION */}
          <section className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/60 border border-white/80 rounded-full text-indigo-700 text-xxs font-bold animate-pulse shadow-xs">
              <Sparkle className="h-3.5 w-3.5 text-indigo-500" />
              국내 유일의 웹툰 · 웹소설 지식재산권(IP) 특화 솔루션
            </div>

            <h1 className="font-sans font-black text-3xl md:text-5xl text-indigo-950 tracking-tight leading-tight max-w-3xl mx-auto">
              당신의 소중한 IP를 위한<br />
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
                초정밀 맞춤형 SNS 마케팅 믹스
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
              로맨스 판타지의 '구원 서사' 클리셰부터 현대 레이드물의 S급 헌터 키워드까지 완벽 분석!<br />
              수석 마케터 '정수아'의 10년 차 실무 전략 알고리즘을 통해, 매체 낭비 없는 완벽한 채널 처방전과 실제와 똑같은 SNS 라이브 프리뷰를 선사합니다.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={startSurvey}
                className="w-full sm:w-auto px-8 py-4 liquid-btn-primary text-white font-bold text-sm tracking-tight rounded-full transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                마케팅 제안서 무료 수립하기
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#simulator"
                className="w-full sm:w-auto px-8 py-4 liquid-btn-secondary text-white font-bold text-sm tracking-tight rounded-full transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Flame className="h-4 w-4 text-white" />
                1초 미니 시뮬레이터 체험
              </a>
            </div>

            <div className="flex items-center justify-center gap-6 pt-6 text-slate-400 text-xxs font-semibold">
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[3px]" /> 실시간 2,410+개 캠페인 빌드
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[3px]" /> 평균 기획서 완성 1분 30초
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[3px]" /> 무작위 할루시네이션 0% 보장
              </span>
            </div>
          </section>

          {/* GEMINI API KEY CONFIGURATION CARD */}
          <section id="api-key-section" className="max-w-xl mx-auto scroll-mt-24">
            <div className="liquid-glass rounded-3xl p-6 md:p-8 border border-white/50 shadow-md text-center relative overflow-hidden">
              {/* Abstract decorative graphics for high aesthetic appeal */}
              <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-violet-500/10 blur-xl" />
              <div className="absolute -left-16 -bottom-16 h-36 w-36 rounded-full bg-pink-500/10 blur-xl" />

              <div className="relative z-10 space-y-4">
                <div className="h-12 w-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto text-indigo-700 shadow-xs">
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                
                <div>
                  <h3 className="font-sans font-black text-slate-900 text-base md:text-lg tracking-tight">
                    Gemini API Key 연동 설정
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed mt-1">
                    본인의 Gemini API Key를 입력하여 전용 인프라에서 제한 없이 초고속으로 제안서를 자동 생성하세요.
                  </p>
                </div>

                <div className="space-y-3.5 text-left pt-2">
                  <div className="relative">
                    <input
                      type={showKey ? "text" : "password"}
                      placeholder="AI Studio에서 발급받은 API Key (AIzaSy...) 입력"
                      value={customApiKey}
                      onChange={(e) => setCustomApiKeyState(e.target.value)}
                      className="w-full pl-4 pr-11 py-3 bg-white/70 border border-slate-200/80 rounded-full text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/60 transition-all text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                    >
                      {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  {validationMessage && (
                    <div className={`text-xxs font-bold px-2 py-1.5 rounded-lg flex items-center gap-1.5 border ${
                      validationStatus === "success" 
                        ? "bg-emerald-50/80 text-emerald-700 border-emerald-100" 
                        : "bg-rose-50/80 text-rose-700 border-rose-100"
                    }`}>
                      {validationStatus === "success" ? (
                        <>
                          <Check className="h-3.5 w-3.5 shrink-0" />
                          <span>{validationMessage}</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{validationMessage}</span>
                        </>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveAndValidateKey(customApiKey)}
                      disabled={isValidating}
                      className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-lg active:scale-[0.98] text-white font-bold text-xs rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isValidating ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          검증 및 저장하는 중...
                        </>
                      ) : (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          API Key 등록 및 승인
                        </>
                      )}
                    </button>
                    
                    {customApiKey && (
                      <button
                        onClick={() => {
                          handleSaveAndValidateKey("");
                          setCustomApiKeyState("");
                        }}
                        className="px-4 py-3 bg-white/60 hover:bg-white/90 border border-slate-200 text-slate-600 font-bold text-xs rounded-full transition-all hover:text-slate-800 cursor-pointer"
                      >
                        초기화
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/40 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    🔒 필수 사항: 이 서비스를 이용하려면 본인의 Gemini API Key를 발급받아 등록해야 하며, 입력된 정보는 브라우저 내부 LocalStorage에만 안전하게 보관됩니다.
                  </span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline font-bold"
                  >
                    Google AI Studio에서 발급 받기 ↗
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* INTERACTIVE SIMULATOR WIDGET */}
          <section id="simulator" className="scroll-mt-24">
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Live Demo Sandbox</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-950 tracking-tight">
                ⚡ 실시간 1초 마케팅 시뮬레이터
              </h2>
              <p className="text-xs md:text-sm text-slate-500 max-w-lg mx-auto">
                마케터 수아의 정밀 장르-타겟 알고리즘을 미리 경험해보세요. 버튼을 선택하는 순간 즉각적인 처방안이 업데이트됩니다.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-4xl mx-auto text-left relative overflow-hidden p-1 rounded-3xl">
              {validationStatus !== "success" && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-3xl z-30 flex flex-col items-center justify-center p-6 text-center border border-white/50 shadow-sm animate-fadeIn">
                  <div className="h-14 w-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-4 text-indigo-700 shadow-sm animate-bounce">
                    <BadgeAlert className="h-7 w-7" />
                  </div>
                  <h3 className="font-sans font-black text-slate-900 text-base md:text-lg tracking-tight mb-2">
                    시뮬레이터 비활성화 상태
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mb-5 leading-relaxed">
                    실시간 AI 마케팅 제안 수립과 시뮬레이터 기능을 사용하기 위해 먼저 <strong>Gemini API Key 승인</strong>을 완료해 주세요.
                  </p>
                  <button
                    onClick={() => {
                      const element = document.getElementById("api-key-section");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" });
                        const card = element.querySelector(".liquid-glass");
                        if (card) {
                          card.classList.add("ring-4", "ring-indigo-500/50");
                          setTimeout(() => {
                            card.classList.remove("ring-4", "ring-indigo-500/50");
                          }, 3000);
                        }
                      }
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4" />
                    Gemini API Key 승인 페이지로 이동
                  </button>
                </div>
              )}

              {/* Left: Input Selection Panel */}
              <div className="lg:col-span-5 liquid-glass p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest font-mono block mb-2">STEP 01</span>
                  <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-indigo-500" />
                    IP 장르군 선택
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {["로맨스 판타지", "현대 판타지", "무협/퓨전", "스포츠/학원물"].map((genre) => (
                      <button
                        key={genre}
                        onClick={() => setDemoGenre(genre)}
                        className={`py-2 px-3 text-xxs font-bold rounded-full transition-all border text-center cursor-pointer ${
                          demoGenre === genre
                            ? "liquid-btn-primary text-white border-transparent"
                            : "bg-white/40 hover:bg-white/70 text-slate-700 border-white/60"
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest font-mono block mb-2">STEP 02</span>
                  <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-indigo-500" />
                    핵심 독자 타겟층 설정
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {["10대 남성", "20대 여성", "30대 남성", "40대 이상"].map((target) => (
                      <button
                        key={target}
                        onClick={() => setDemoTarget(target)}
                        className={`py-2 px-3 text-xxs font-bold rounded-full transition-all border text-center cursor-pointer ${
                          demoTarget === target
                            ? "liquid-btn-primary text-white border-transparent"
                            : "bg-white/40 hover:bg-white/70 text-slate-700 border-white/60"
                        }`}
                      >
                        {target}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/50 rounded-2xl p-4.5 border border-white/60 text-[11px] text-indigo-900 leading-relaxed font-medium">
                  💡 본 마케팅 시뮬레이터는 <strong>{demoGenre}</strong> 작품과 <strong>{demoTarget}</strong> 독자 조합의 성향 데이터를 바탕으로 동작하고 있습니다.
                </div>
              </div>

              {/* Right: Output prescription card */}
              <div className="lg:col-span-7 liquid-glow-box text-slate-900 p-6 md:p-8 rounded-3xl shadow-lg border border-white/60 relative flex flex-col justify-between overflow-hidden">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />
                
                <div>
                  <div className="flex items-center justify-between border-b border-indigo-950/10 pb-4 mb-5">
                    <span className="text-xxs font-bold text-indigo-950/70 tracking-wider font-mono">INSTANT prescription #041</span>
                    <span className="flex items-center gap-1 bg-indigo-600/10 border border-indigo-600/20 text-indigo-800 px-2 py-0.5 rounded-full text-[9px] font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Live Matching
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Keywords block */}
                    <div>
                      <p className="text-[10px] text-indigo-950/70 font-mono uppercase font-bold tracking-widest mb-1.5">SUGGESTED KEYWORDS</p>
                      <div className="flex flex-wrap gap-1.5">
                        {getDemoSample(demoGenre, demoTarget).keywords.map((kw, i) => (
                          <span key={i} className="text-[10px] bg-white/60 text-indigo-900 font-semibold px-2 py-0.5 rounded border border-white/80">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tagline block */}
                    <div>
                      <p className="text-[10px] text-indigo-950/70 font-mono uppercase font-bold tracking-widest mb-1.5">SAMPLE COPYWRITING</p>
                      <div className="bg-white/40 border border-white/50 rounded-2xl p-4 relative">
                        <span className="absolute -left-1 -top-2 text-3xl text-indigo-600/30 font-serif leading-none">“</span>
                        <p className="text-xs font-bold leading-relaxed text-slate-900 pr-4 pl-1">
                          {getDemoSample(demoGenre, demoTarget).tagline}
                        </p>
                        <span className="absolute right-2 bottom-1 text-3xl text-indigo-600/30 font-serif leading-none">”</span>
                      </div>
                    </div>

                    {/* Optimized Channels */}
                    <div>
                      <p className="text-[10px] text-indigo-950/70 font-mono uppercase font-bold tracking-widest mb-1.5">VIRAL CHANNELS</p>
                      <div className="flex flex-wrap gap-2">
                        {getDemoSample(demoGenre, demoTarget).channels.map((ch, i) => (
                          <span key={i} className="text-[10px] bg-indigo-600/10 border border-indigo-600/20 text-indigo-900 font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-indigo-500" />
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-indigo-950/10 pt-4 mt-6 flex items-center justify-between text-xxs font-medium text-slate-600">
                  <span>예상 성과 지표</span>
                  <span className="text-indigo-700 font-bold flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {getDemoSample(demoGenre, demoTarget).benefitText}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* VALUE PROPOSITION BENTO GRID */}
          <section className="space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Our Core Strengths</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-950 tracking-tight">
                당신의 마케팅 제안서가 특별한 세 가지 이유
              </h2>
              <p className="text-xs md:text-sm text-slate-500 max-w-lg mx-auto">
                단순한 텍스트 나열을 넘어, IP 마케팅의 본질에 다가가 독자의 가슴을 뛰게 만듭니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Card 1 */}
              <div className="glass-card bg-white/95 rounded-3xl p-6 border border-slate-200/60 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 border border-indigo-100">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h4 className="font-sans font-bold text-sm text-slate-900 mb-2">
                    초정밀 장르 타겟 매칭 (할루시네이션 0%)
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    사용하지 않는 광고 채널을 억지로 추천하거나 터무니없는 타겟 전략을 제시하지 않습니다. 사용자가 입력한 플랫폼 특성, 클리셰, 핵심 독자층에만 100% 한정된 데이터 정합성을 기반으로 완벽한 전략을 처방합니다.
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-4 mt-6 text-xxs text-indigo-600 font-semibold flex items-center gap-1">
                  <span>자체 검증 엔진 탑재 완료</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="glass-card bg-white/95 rounded-3xl p-6 border border-slate-200/60 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-5 border border-pink-100">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <h4 className="font-sans font-bold text-sm text-slate-900 mb-2">
                    인스타그램 • 트위터 • 커뮤니티 실제 프리뷰
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    기획서 안에서 카피가 어떻게 나타날지 막막했나요? 인스타그램 카드뉴스, 트위터(X) 주접글 피드, 디시인사이드 특유의 본문 밈 레이아웃까지 실제 스크린과 완벽히 동기화된 가상 시뮬레이터 뷰로 실시간 확인할 수 있습니다.
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-4 mt-6 text-xxs text-pink-600 font-semibold flex items-center gap-1">
                  <span>3개 주요 SNS 템플릿 실시간 구동</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="glass-card bg-white/95 rounded-3xl p-6 border border-slate-200/60 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 border border-amber-100">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h4 className="font-sans font-bold text-sm text-slate-900 mb-2">
                    10단계 순차 기획 (1:1 Sequential Mentor)
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    복잡한 마케팅 개념을 한꺼번에 적을 필요가 전혀 없습니다. 실무 10년 차 수석 마케터 수아의 세심한 10단계 질문을 순서대로 클릭하고 대답하다 보면, 누구나 전문가 수준의 기획서 초안을 저절로 컴파일하게 됩니다.
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-4 mt-6 text-xxs text-amber-700 font-semibold flex items-center gap-1">
                  <span>정수아 수석 기획자 알고리즘 수록</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </section>

          {/* ROADMAP SECTION (10 STEPS) */}
          <section className="glass-card bg-white/95 rounded-3xl p-8 border border-slate-200/60 shadow-sm max-w-4xl mx-auto text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ClipboardCheck className="h-5.5 w-5.5 text-indigo-600 animate-pulse" />
                  수석 마케터의 10단계 기획 프로세스 맵
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  초정밀 제안서 구성을 위해 수집되는 핵심 메타데이터 구성 정보입니다.
                </p>
              </div>
              <button
                onClick={startSurvey}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all self-start md:self-auto flex items-center gap-1.5 cursor-pointer"
              >
                기획 즉시 시작하기
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
              {[
                { step: "00", title: "캠페인 목표 수립 (KPI)", desc: "작품 유입, 신규 구매, 단행본 판매 등 타겟 KPI 분할 정의" },
                { step: "01", title: "클리셰 맞춤 장르 선택", desc: "로판, 현대물, 무협, 아카데미 등 장르 고유의 장치 매칭" },
                { step: "02", title: "주력 유통 플랫폼 연계", desc: "네이버, 카카오, 리디 등 플랫폼 독자들의 소비 성향 연동" },
                { step: "03", title: "코어 타겟 독자군 공략", desc: "성별과 연령대를 교차 결합한 바이럴 소구 타겟 추출" },
                { step: "04", title: "회차 진행 단계 설정", desc: "초반 런칭, 중반 회차 주행, 완결 및 정주행 등 단계별 캠페인" },
                { step: "05", title: "브랜드 보이스 톤앤매너", desc: "주접형, 공식 안내형, 서사 몰입형 등 카피라이팅 기조 셋업" },
                { step: "06", title: "기획 키워드 및 비교작품", desc: "세계관 키워드 및 레퍼런스 작 매칭을 통한 시너지 카피" },
                { step: "07", title: "바이럴 채널 믹스 선택", desc: "인스타그램, 트위터(X), 디시/에펨, 포스타입 등 맞춤 채널" },
                { step: "08", title: "정기 연재 업로드 요일", desc: "실제 업로드 연재 요일에 따른 주간 노출 일정 최적 배치" },
                { step: "09", title: "무료 및 할인 프로모션", desc: "3다무, 매열무, 대여권 10장 등 이벤트를 카피라이팅에 결합" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 hover:bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                  <span className="h-6 w-6 rounded bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-600 flex items-center justify-center font-mono shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <p className="font-bold text-slate-800 text-xs mb-0.5">{item.title}</p>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PERSONA QUOTES / TESTIMONIALS */}
          <section className="space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">IP Success Stories</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-950 tracking-tight">
                웹소설 작가, 웹툰 PD들이 극찬하는 마케팅 도구
              </h2>
              <p className="text-xs md:text-sm text-slate-500 max-w-lg mx-auto">
                출시와 동시에 수많은 IP 현업 실무자 분들의 기획 시간을 아껴드렸습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
              {/* Testimonial 1 */}
              <div className="glass-card bg-white/95 p-6 rounded-3xl border border-slate-200/60 shadow-xs relative">
                <div className="absolute right-6 top-6 text-indigo-100">
                  <span className="font-serif text-5xl select-none leading-none">“</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-xs">
                    YL
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">이연지 작가</p>
                    <p className="text-[10px] text-slate-400">카카오페이지 로맨스판타지 작가</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  "SNS 홍보 카피 쓸 때마다 늘 독자의 ‘주접 밈’을 어떻게 녹일지 막막했는데, 제 로판 작품의 클리셰와 남주 성격을 집어넣으니 정말 찰떡같은 트위터(X) 멘트와 해시태그가 즉시 생성되어 소장권 프로모션 매출이 크게 늘었습니다!"
                </p>
                <div className="flex gap-1.5 mt-4 text-[10px] text-indigo-600 font-bold">
                  <Heart className="h-3 w-3 fill-indigo-100" />
                  <span>최종 매출 유입 지표 42% 증가 증명</span>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="glass-card bg-white/95 p-6 rounded-3xl border border-slate-200/60 shadow-xs relative">
                <div className="absolute right-6 top-6 text-pink-100">
                  <span className="font-serif text-5xl select-none leading-none">“</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-pink-100 text-pink-600 font-bold flex items-center justify-center text-xs">
                    MJ
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">김민재 PD</p>
                    <p className="text-[10px] text-slate-400">웹툰 전문 기획사 수석 PD</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  "요일별 정기 콘텐츠 일정과 채널별 캘린더까지 요일 정합성을 딱 지켜서 컴파일되니까, 마케터 팀원들에게 매번 설명하지 않고도 바로 제안서를 쏴줄 수 있어요. 인스타그램 카드뉴스 시각화 템플릿은 기안 올릴 때 정말 최고의 파트너입니다."
                </p>
                <div className="flex gap-1.5 mt-4 text-[10px] text-pink-600 font-bold">
                  <ThumbsUp className="h-3 w-3 fill-pink-100" />
                  <span>회의 준비 및 기획 시간 90% 단축</span>
                </div>
              </div>
            </div>
          </section>

          {/* FINAL CALL TO ACTION BANNER */}
          <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden max-w-4xl mx-auto border border-slate-800">
            <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-indigo-500/10 blur-2xl" />
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-pink-500/10 blur-2xl" />
            
            <div className="relative space-y-6 max-w-xl mx-auto">
              <h3 className="text-xl md:text-3xl font-bold tracking-tight">
                지금 귀하의 웹툰·웹소설 IP를 위한<br />
                독점 마케팅 믹스를 설계해 보세요.
              </h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                어렵고 까다로운 마케팅 기획서, 수석 마케터 수아와 함께 10단계 순차 질문 대화방에서 단 2분 만에 해결해 드립니다.
              </p>
              <div className="pt-2">
                <button
                  onClick={startSurvey}
                  className="w-full sm:w-auto px-8 py-4 liquid-btn-primary text-white font-bold text-sm tracking-tight rounded-full transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  기획안 수립 10단계 시작하기
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

        </main>
      )}

      {/* SURVEY STATE (CORE SEQUENTIAL QUESTION WIZARD) */}
      {appState === "survey" && (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Progress Timeline */}
            <div className="lg:col-span-3">
              <StepTimeline
                currentStepIndex={currentStepIdx}
                answers={answers}
                onStepClick={handleStepJump}
                highestStepReached={highestStepReached}
              />
            </div>

            {/* Center Column: Interactive Active Question Box */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Marketer's Profile Intro Bubble */}
              <div className="liquid-glass border border-white/50 rounded-2xl p-4 text-slate-800 flex items-center gap-3 shadow-sm">
                {/* Visual Avatar */}
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shrink-0 shadow-md">
                  수아
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="font-sans font-bold text-xs text-indigo-950">정수아 수석 기획자</h5>
                    <span className="bg-indigo-600/10 text-indigo-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-indigo-600/20">실무 10년차</span>
                  </div>
                  <p className="text-[10px] text-slate-600">"작품의 클리셰와 플랫폼의 궁합을 고려하여 질문을 하나씩 신중히 드릴게요."</p>
                </div>
              </div>

              {/* Main Question Card */}
              <div className="liquid-glass rounded-3xl p-6 md:p-8 shadow-sm border border-white/50">
                
                {/* Header info */}
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase flex items-center gap-1.5">
                    {getStepIcon(currentStep.icon)}
                    Step {currentStepIdx}. {currentStep.title}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {currentStepIdx} / {STEPS.length - 1} Steps
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-indigo-950/10 rounded-full overflow-hidden mb-8">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(79,70,229,0.5)]"
                    style={{ width: `${(currentStepIdx / (STEPS.length - 1)) * 100}%` }}
                  />
                </div>

                <h2 className="font-sans font-bold text-slate-900 text-xl md:text-2xl tracking-tight leading-snug mb-2">
                  {currentStep.question}
                </h2>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed mb-8">
                  {currentStep.description}
                </p>

                {/* Marketer Feedback Reaction Banner (Requirement A-2) */}
                {showReaction && reactionText && (
                  <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4.5 mb-6 flex items-start gap-2.5 animate-fadeIn">
                    <span className="text-base shrink-0 mt-0.5">💬</span>
                    <p className="text-xs text-indigo-900 leading-relaxed font-semibold">
                      {reactionText}
                    </p>
                  </div>
                )}

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentStep.options.map((option, idx) => {
                    const isSelected = currentStep.type === "multiple"
                      ? selectedMultipleOptions.includes(option.label)
                      : answers[currentStep.key] === option.label || (option.isCustom && customInputValue !== "" && answers[currentStep.key] === customInputValue);
                    const optIndexStr = String(idx + 1).padStart(2, "0");

                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          if (currentStep.type === "multiple") {
                            handleMultipleSelectToggle(option);
                          } else {
                            handleSingleSelect(option);
                          }
                        }}
                        id={`option-${option.id}`}
                        className={`w-full text-left p-5 rounded-2xl border flex flex-col gap-2 relative transition-all duration-300 group cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-tr from-violet-600/80 to-indigo-600/80 text-white border-white/50 shadow-md backdrop-blur-md"
                            : "bg-white/30 hover:bg-white/50 border-white/40 hover:border-white/60 text-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className={`font-mono font-bold text-xs ${isSelected ? "text-white/95" : "text-slate-400"}`}>
                            {optIndexStr}
                          </span>
                          <div
                            className={`h-5 w-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                              isSelected
                                ? "bg-white border-white text-indigo-600 shadow-sm"
                                : "border-slate-200 group-hover:border-slate-300 bg-white/60"
                            }`}
                          >
                            {isSelected && <span className="text-[10px] font-black">✓</span>}
                          </div>
                        </div>

                        <p className={`font-semibold text-xs tracking-tight leading-snug ${isSelected ? "text-white font-black" : "text-slate-800"}`}>
                          {option.label}
                        </p>

                        {option.description && (
                          <p className={`text-[10px] leading-relaxed font-normal ${isSelected ? "text-white/85" : "text-slate-400"}`}>
                            {option.description}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Direct Custom Input Workspace Section */}
                {(currentStep.options.some(opt => opt.isCustom && answers[currentStep.key] === "") || currentStep.type === "text") && (
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700 tracking-tight mb-2">
                      ✍️ 직접 상세 정보 입력
                    </label>
                    <textarea
                      value={customInputValue}
                      onChange={(e) => setCustomInputValue(e.target.value)}
                      placeholder={
                        currentStep.type === "text" 
                          ? "예: 로판 회귀물, 사이다 복수극, <화산귀환>처럼 유쾌하고 압도적인 먼치킨 주인공 서사 강조" 
                          : "직접 원하시는 마케팅 세부 사항을 기재해주세요."
                      }
                      id="custom-text-input"
                      rows={3}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-300 leading-relaxed"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={handleCustomSubmit}
                        disabled={!customInputValue.trim()}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                          customInputValue.trim()
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                            : "bg-slate-100 text-slate-300 cursor-not-allowed"
                        }`}
                      >
                        입력 완료 후 다음으로
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Action controls row */}
                <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
                  <button
                    onClick={handlePrevStep}
                    className="px-4 py-2 hover:bg-slate-50 border border-slate-100 text-slate-600 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    이전 단계
                  </button>

                  {/* Manual trigger for multiple choice step to proceed */}
                  {currentStep.type === "multiple" && (
                    <button
                      onClick={advanceStep}
                      disabled={selectedMultipleOptions.length === 0}
                      className={`px-5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedMultipleOptions.length > 0
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                          : "bg-slate-100 text-slate-300 cursor-not-allowed"
                      }`}
                    >
                      기획 단계 진행
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

              </div>

            </div>

            {/* Right Column: Live Board */}
            <div className="lg:col-span-3">
              <LiveSummarySidebar answers={answers} />
            </div>

          </div>
        </main>
      )}

      {/* CONFIRMATION / SUMMARY STATE (Requirement C) */}
      {appState === "summary" && (
        <main className="max-w-xl mx-auto px-4 py-12">
          <div className="liquid-glass rounded-3xl border border-white/50 p-6 md:p-8 shadow-sm text-center">
            
            <div className="h-12 w-12 bg-white/40 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/60 shadow-xs">
              <ClipboardCheck className="h-6 w-6" />
            </div>

            <h2 className="font-sans font-bold text-slate-900 text-lg md:text-xl tracking-tight mb-2">
              최종 기획 정보 분석 요약
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              아래 요약된 마케팅 핵심 요소를 최종 검토해 주세요.
            </p>

            {/* ERROR TEXT IN SUMMARY */}
            {errorText && (
              <div className="bg-red-50/70 border border-red-100 rounded-xl p-3 mb-6 flex items-start gap-2.5 text-left text-xs text-red-700 font-medium">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{errorText}</p>
              </div>
            )}

            {/* Precise 5-line summary box (Requirement C constraint) */}
            <div className="bg-white/40 border border-white/60 rounded-2xl p-5 mb-8 text-left space-y-3 shadow-xs">
              {generateFiveLineSummary().map((line, idx) => (
                <p key={idx} className="text-xs text-slate-700 font-semibold border-b border-white/40 pb-2 last:border-0 last:pb-0 truncate">
                  {line}
                </p>
              ))}
            </div>

            {/* Core user confirmation query prompt */}
            <p className="text-xs font-bold text-slate-800 mb-6">
              이 내용으로 기획안을 작성해도 될까요?
            </p>

            {/* Buttons column */}
            <div className="space-y-2.5">
              <button
                onClick={handleConfirmAndGenerate}
                className="w-full py-4 liquid-btn-primary text-white font-bold text-xs tracking-tight rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                기획안 작성 시작 (Confirm & Generate)
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => handleStepJump(0)}
                className="w-full py-4 liquid-btn-secondary text-white font-bold text-xs tracking-tight rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                기획 정보 수정하러 돌아가기
              </button>
            </div>

          </div>
        </main>
      )}

      {/* GENERATING / LOADING STATE */}
      {appState === "generating" && (
        <main className="max-w-md mx-auto px-4 py-24 text-center">
          <div className="liquid-glass rounded-3xl border border-white/50 p-8 shadow-sm">
            
            {/* Spinning loading icon */}
            <div className="flex items-center justify-center mb-6">
              <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
            </div>

            <h3 className="font-sans font-bold text-slate-900 text-sm tracking-tight mb-2">
              AI 제안서 컴파일링 중
            </h3>
            
            {/* Transitioning reassuring loading labels (advice-compliant) */}
            <div className="h-10 flex items-center justify-center">
              <p className="text-xs text-indigo-600 leading-relaxed font-bold animate-pulse">
                {loadingMessages[loadingMessageIdx]}
              </p>
            </div>

            {/* Elegant visual progress indicator */}
            <div className="mt-8 space-y-3 text-left border-t border-white/40 pt-6">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-ping" />
                <span>마케팅 제안 수립 프로세스 진행률</span>
              </div>
              <div className="w-full bg-indigo-950/10 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-violet-500 to-indigo-600 h-1.5 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(79,70,229,0.4)]"
                  style={{ width: `${(loadingMessageIdx + 1) * 20}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                정수아 기획자의 10년 차 실무 전략 알고리즘 반영 중...
              </p>
            </div>

          </div>
        </main>
      )}

      {/* COMPLETED PROPOSAL PRESENTATION STATE */}
      {appState === "result" && (
        <main className="animate-fadeIn">
          <ProposalViewer
            planText={generatedPlan}
            answers={answers}
            onReset={startSurvey}
          />
        </main>
      )}

    </div>
  );
}
