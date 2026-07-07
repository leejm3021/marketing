import { StepDefinition } from "./types";

export const STEPS: StepDefinition[] = [
  {
    key: "step0",
    title: "Step 0. 캠페인 목표 (KPI)",
    question: "이번 마케팅으로 달성하고 싶은 핵심 목표는 무엇인가요?",
    description: "목표에 따라 카피의 후킹 포인트와 CTA(행동 유도) 설계가 완전히 달라집니다.",
    type: "single",
    icon: "Target",
    reactionPrefix: "마케팅의 첫 단추인 목표를",
    options: [
      { id: "kpi_1", label: "신규 독자 유입 / 구독 전환 극대화", description: "작품의 초반 진입장벽을 낮추고 첫 화 감상을 적극 유도합니다." },
      { id: "kpi_2", label: "기존 독자 리텐션 및 입소문(바이럴) 확산", description: "팬덤의 충성도를 높이고 주요 전개에 대한 입소문을 자극합니다." },
      { id: "kpi_3", label: "완결 또는 시즌2 예고 프로모션", description: "장기 휴재 복귀 전 분위기를 띄우거나 완결 직전 유입을 도모합니다." },
      { id: "kpi_4", label: "콜라보/굿즈 연계 프로모션", description: "단순 열람을 넘어 실물 굿즈 구매나 브랜드 콜라보 참여를 유도합니다." },
      { id: "kpi_5", label: "무료 정주행 이벤트 유입", description: "한시적 무료 오픈 기간에 최대한 많은 정주행 독자를 유치합니다." },
      { id: "custom", label: "[직접 입력] 위에 없는 목표를 직접 입력합니다.", isCustom: true }
    ]
  },
  {
    key: "step1",
    title: "Step 1. 장르",
    question: "홍보하고자 하는 작품의 장르는 어떻게 되나요?",
    description: "장르별 독자의 선호 키워드와 시장 트렌드를 저격하는 카피 톤을 매칭합니다.",
    type: "single",
    icon: "BookOpen",
    reactionPrefix: "장르 시장에 아주 흥미로운 전략을 세울 수 있겠군요!",
    options: [
      { id: "genre_1", label: "로맨스판타지 (로판)", description: "빙의, 환생, 악녀, 계약결혼 등 여심을 자극하는 서사적 클리셰 강조" },
      { id: "genre_2", label: "판타지 / 무협", description: "회귀, 먼치킨, 문파 부흥, 절대자 등 정통 남성향 사이다 감성" },
      { id: "genre_3", label: "현대판타지 (현판) / 인방물", description: "헌터물, 상태창, 직장인 성공기, 인터넷 방송 등 강렬한 대리만족" },
      { id: "genre_4", label: "로맨스 / 드라마", description: "오피스, 캠퍼스, 치정, 감성, 일상물 등 현실적 공감대와 텐션" },
      { id: "genre_5", label: "학원 / 액션 / 스릴러", description: "복수, 두뇌 싸움, 긴장감 넘치는 연출과 쾌감 위주" },
      { id: "custom", label: "[직접 입력] 직접 장르를 입력합니다.", isCustom: true }
    ]
  },
  {
    key: "step2",
    title: "Step 2. 연재 플랫폼 (유통처)",
    question: "해당 작품이 연재 중이거나 서비스될 유통 플랫폼은 어디인가요?",
    description: "플랫폼별 주류 독자의 연령대, 성향, 과금 방식이 상이하므로 필수적인 수집 정보입니다.",
    type: "single",
    icon: "Smartphone",
    reactionPrefix: "독자층 성향이 뚜렷한",
    options: [
      { id: "platform_1", label: "네이버시리즈 / 웹툰", description: "정통 판타지/무협의 성지이자, 소장 및 정기 프로모션 독자 탄탄" },
      { id: "platform_2", label: "카카오페이지 / 웹툰", description: "기다무 기반 로판/현판의 메카이며 독자 댓글 소통과 바이럴 활발" },
      { id: "platform_3", label: "리디 (RIDI)", description: "단행본 및 여성향/e북 마니아 독자층의 선호도가 높은 프리미엄 연재처" },
      { id: "platform_4", label: "문피아 / 조아라", description: "남성향 판타지/웹소설의 등용문이자 신작 정주행 반응이 가장 빠른 곳" },
      { id: "platform_5", label: "레진코믹스 / 탑툰", description: "드라마, 성인, 독점 장르 등 딥한 취향의 독자층이 모여있는 플랫폼" },
      { id: "custom", label: "[직접 입력] 직접 연재 플랫폼을 입력합니다.", isCustom: true }
    ]
  },
  {
    key: "step3",
    title: "Step 3. 핵심 타겟 독자층",
    question: "이 캠페인에서 최우선으로 타겟팅할 독자 그룹은 누구인가요?",
    description: "연령, 성별, 취향을 명확히 설정하여 타겟 소구점을 예리하게 좁힙니다.",
    type: "single",
    icon: "Users",
    reactionPrefix: "정확한 마케팅 화살을 쏘기 위해",
    options: [
      { id: "target_1", label: "10-20대 여성 (로맨스/드라마 팬덤)", description: "비주얼, 트렌디한 밈, 감정적 과몰입과 바이럴에 특화된 층" },
      { id: "target_2", label: "20-30대 남성 (판타지/사이다패스 선호)", description: "빠른 전개, 먼치킨적 카타르시스, 스탯 창 및 성장형 서사 충성층" },
      { id: "target_3", label: "20대 여성 (로판/빙의물/회빙환 마니아)", description: "정밀한 고증, 관계성 텐션, 악역 참교육 및 권선징악에 과몰입하는 독자층" },
      { id: "target_4", label: "30-40대 직장인 남녀 (정주행/일상 힐링/사이다물)", description: "직장 스트레스 해소용 사이다 액션 혹은 지친 일상에 온기를 주는 힐링물 선호" },
      { id: "target_5", label: "10대 학원 액션 및 서브컬처 팬덤", description: "자극적인 대사, 화려한 액션 연출, 캐릭터성 자체를 덕질하는 타겟군" },
      { id: "custom", label: "[직접 입력] 직접 타겟 독자층을 설정합니다.", isCustom: true }
    ]
  },
  {
    key: "step4",
    title: "Step 4. 연재 진행 단계",
    question: "현재 작품의 연재 진행 단계는 어디에 속하나요?",
    description: "스토리의 스포일러 허용 범위와 매력적인 후킹 지점이 연재 진도에 따라 결정됩니다.",
    type: "single",
    icon: "TrendingUp",
    reactionPrefix: "연재 진도에 맞는 입체적인 전략으로,",
    options: [
      { id: "stage_1", label: "초반 극후킹형 (1~10화 신규 런칭 홍보)", description: "스포일러 없이 세계관 설정과 주인공의 첫 빌드업만으로 호기심 최고조 유발" },
      { id: "stage_2", label: "중반 몰입형 (핵심 떡밥 회수 및 대결 전개 공개)", description: "가장 재미있는 하이라이트 갈등 국면을 노출해 정주행 심리 극대화" },
      { id: "stage_3", label: "완결 임박형 (최종 국면 돌입, 폭풍 질주)", description: "떡밥이 모두 회수되는 엔딩 직전의 전율을 강조해 유입 유도" },
      { id: "stage_4", label: "완결 후 프로모션 (전편 정주행 및 할인 공략)", description: "기다림 없이 끝까지 한번에 볼 수 있는 메리트와 완결 기념 혜택 부각" },
      { id: "stage_5", label: "시즌2 / 후속작 예고형 (장기 복귀 사전 마케팅)", description: "쉬어가는 독자들을 다시 불러모으기 위한 전 시즌 복습 및 티징 전략" },
      { id: "custom", label: "[직접 입력] 직접 연재 단계를 입력합니다.", isCustom: true }
    ]
  },
  {
    key: "step5",
    title: "Step 5. 톤앤매너 (브랜드 보이스)",
    question: "SNS 상에서 마케팅 카피가 가질 브랜드 보이스는 어떤 느낌인가요?",
    description: "작품의 무드와 어울리는 문체를 선택해야 잠재 독자가 광고 이질감을 덜 느낍니다.",
    type: "single",
    icon: "Sparkles",
    reactionPrefix: "작품의 개성을 돋보이게 해줄",
    options: [
      { id: "tone_1", label: "감성/몰입형 (수려한 일러스트와 서정적 서사 강조)", description: "고급스럽고 여운이 남는 어조로 작품의 감정선에 깊이 빠져들게 합니다." },
      { id: "tone_2", label: "유머/드립형 (밈과 유행어 적극 차용, 친근함 강조)", description: "최신 밈이나 독특한 언어유희로 가볍게 클릭하고 퍼가고 싶게 설계합니다." },
      { id: "tone_3", label: "자극적/후킹 강조형 (치명적인 대사나 파격 전개 노출)", description: "자극적인 갈등 구도나 도파민 폭발 대사를 활용해 이탈률을 봉쇄합니다." },
      { id: "tone_4", label: "진지/작품성 강조형 (스토리의 개연성과 완성도 부각)", description: "탄탄한 설정, 훌륭한 세계관 짜임새를 강조해 명작을 선호하는 독자들을 타겟팅합니다." },
      { id: "tone_5", label: "트렌디/숏폼 최적화형 (Z세대 감성, 스피디한 연출)", description: "감각적인 키워드 배열과 속도감 있는 호흡으로 시선을 단숨에 낚아챕니다." },
      { id: "custom", label: "[직접 입력] 직접 톤앤매너를 지정합니다.", isCustom: true }
    ]
  },
  {
    key: "step6",
    title: "Step 6. 시놉시스 · 핵심 키워드 · 비교작품",
    question: "작품의 간단한 설정과 비교할만한 유명작(레퍼런스)을 적어주세요.",
    description: "작품의 매력도를 파악하고 경쟁작 대비 본작만의 뛰어난 차별점을 수치 및 텍스트로 도출합니다.",
    type: "text",
    icon: "FileText",
    reactionPrefix: "입력해주신 기획 정보를",
    options: [
      { id: "ref_1", label: "소설 속 엑스트라 빙의물 / 비교작: <소설 속 엑스트라>", description: "원작 소설의 설정을 누구보다 잘 아는 하급 조연으로 빙의해 생존하는 지략 서사" },
      { id: "ref_2", label: "하급 게이트 헌터에서 최강자로 각성 / 비교작: <나 혼자만 레벨업>", description: "무시받던 F급 주인공이 숨겨진 기회를 통해 무한 성장하는 정통 남성향 헌터 카타르시스" },
      { id: "ref_3", label: "계약 결혼으로 시작된 선결혼 후연애 / 비교작: <결혼 장사>", description: "정략적 관계로 맺어졌지만 점차 서로의 상처를 지켜주며 소유욕을 자극하는 숨막히는 밀당" },
      { id: "ref_4", label: "과거로 회귀한 몰락 가문의 대공자 / 비교작: <화산귀환>", description: "가문의 찬란했던 전성기를 복원하기 위해 유쾌하면서도 압도적 실력으로 천하를 뒤흔드는 무협" },
      { id: "ref_5", label: "무시당하던 주인공의 자비 없는 사이다 액션 / 비교작: <싸움독학>", description: "약자였던 주인공이 독창적인 전략과 액션으로 일진들을 하나씩 응징하는 학원 통쾌 복수극" },
      { id: "custom", label: "[직접 입력] 작품 시놉시스, 비교작품을 직접 자유롭게 작성합니다.", isCustom: true }
    ]
  },
  {
    key: "step7",
    title: "Step 7. 마케팅 채널 선택 (중복 가능)",
    question: "마케팅을 진행하고 제안 카피를 얻을 마케팅 채널을 모두 골라주세요.",
    description: "선택해주신 SNS 채널에 대해서만 고도화된 콘텐츠 기획 및 가이드를 제작합니다.",
    type: "multiple",
    icon: "Megaphone",
    reactionPrefix: "가장 효과적인 마케팅 시너지를 위해,",
    options: [
      { id: "instagram", label: "인스타그램 카드뉴스", description: "비주얼 컷 배치를 통한 대사형 가독성과 줄바꿈에 특화된 피드 카피" },
      { id: "shorts", label: "틱톡/유튜브 쇼츠", description: "0~3초 오프닝 훅, 구체적인 비주얼 연출 힌트와 구체적 동사 위주 타임라인 대본" },
      { id: "youtube_long", label: "유튜브 롱폼", description: "심층 요약, 성우 녹음 가이드, 썸네일 카피 2~3안 패키지 기획안" },
      { id: "twitter", label: "X(트위터)", description: "실시간 반응 바이럴, 140자 내외의 강렬한 밈 활용형 스레드형 포스트" },
      { id: "blog_seo", label: "블로그(SEO)", description: "소제목 검색 노출 가이드, 상세 목차 및 깔끔한 줄거리 정리형 포스팅안" },
      { id: "kakao_comm", label: "카카오톡 채널 / 커뮤니티", description: "공식 알림톡 및 클릭 유도형 100자 내외 컴팩트 공지 카피" },
      { id: "custom", label: "[직접 입력] 기타 맞춤 채널 직접 작성", isCustom: true }
    ]
  },
  {
    key: "step8",
    title: "Step 8. 연재 요일",
    question: "해당 작품의 정기 연재 요일이나 업로드 요일은 언제인가요?",
    description: "주간 캘린더 생성 시 요일별 리듬과 연재 당일 알림 효과를 조화롭게 캘린더에 동기화합니다.",
    type: "single",
    icon: "Calendar",
    reactionPrefix: "연재 시점 집중 마케팅을 고려하여,",
    options: [
      { id: "day_1", label: "매주 월요일 정기 연재", description: "월요병 극복을 위한 월요일 00시 업로드 타겟팅 마케팅" },
      { id: "day_2", label: "매주 화요일/금요일 연재 (주 2회)", description: "주중 2회 독자 방문 주기를 맞춰 화력 분산 및 연속성 극대화" },
      { id: "day_3", label: "매주 토요일/일요일 연재 (주말 집중)", description: "주말 휴일 동안 몰아보는 라이트 노벨/정주행 유저 공략" },
      { id: "day_4", label: "주 5회 연재 (월~금 평일 매일)", description: "출퇴근/등하교 일상 루틴을 파고들어 매일 정주행 분위기 연출" },
      { id: "day_5", label: "매일 연재 (연중무휴)", description: "매일 도파민 수급을 원하는 코어 과금 독자를 위한 항시 대기 마케팅" },
      { id: "custom", label: "[직접 입력] 연재 요일을 직접 입력합니다.", isCustom: true }
    ]
  },
  {
    key: "step9",
    title: "Step 9. 프로모션/이벤트 일정",
    question: "이번 마케팅과 연동해 진행하는 무료 혜택이나 이벤트 일정이 있나요?",
    description: "할인 혜택이나 대여권 프로모션 유무는 구매 전환율을 높이는 가장 결정적인 장치입니다.",
    type: "single",
    icon: "Gift",
    reactionPrefix: "독자 유입의 가장 강력한 무기인",
    options: [
      { id: "event_1", label: "런칭 기념 '3시간마다 무료 (3다무)' 프로모션 적용", description: "초반에 강력하게 과금 문턱을 낮춰 엄청난 트래픽 폭증 유발" },
      { id: "event_2", label: "대여권 10장 무상 즉시 지급 이벤트", description: "독자 지갑을 열게 만드는 즉각적이고 구체적인 구매 후크" },
      { id: "event_3", label: "전편 정주행 완료 시 100% 캐시백 / 리워드 이벤트", description: "중단 없는 고회차 연속 열람 독자를 양성하는 완독 레이싱" },
      { id: "event_4", label: "특별 한정 굿즈 와디즈 크라우드 펀딩 개시 예정", description: "소장 욕구가 가득한 고관여 코어 팬덤용 프리미엄 이벤트" },
      { id: "event_5", label: "완결 기념 전편 30% 특별 할인 및 무료 회차 증설", description: "아직 완독하지 않은 소극적 유저들에게 명분을 던져주는 타겟 세일" },
      { id: "custom", label: "[직접 입력] 프로모션 및 이벤트 일정을 직접 작성합니다.", isCustom: true }
    ]
  }
];
