import React, { useState } from "react";
import { SurveyAnswers } from "../types";
import { 
  Copy, Check, Printer, Share2, Instagram, Youtube, Twitter, 
  MessageSquare, BookOpen, Sparkles, TrendingUp, FileText, 
  Layers, Eye, Calendar, AlertCircle, RefreshCw, Send, ShieldCheck
} from "lucide-react";

interface ProposalViewerProps {
  planText: string;
  answers: SurveyAnswers;
  onReset: () => void;
}

export default function ProposalViewer({ planText, answers, onReset }: ProposalViewerProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"document" | "mockups">("document");
  const [selectedMockupChannel, setSelectedMockupChannel] = useState<string>("");

  // Copy full plan to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(planText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple print handler
  const handlePrint = () => {
    window.print();
  };

  // Helper to parse sections from markdown response
  const getSectionContent = (titleNum: number, nextTitleNum: number) => {
    const lines = planText.split("\n");
    let capturing = false;
    let contentLines: string[] = [];

    const startPatterns = [
      `## ${titleNum}.`, 
      `${titleNum}.`
    ];
    const endPatterns = [
      `## ${nextTitleNum}.`, 
      `${nextTitleNum}.`
    ];

    for (let line of lines) {
      const isStart = startPatterns.some(pat => line.trim().startsWith(pat));
      const isEnd = endPatterns.some(pat => line.trim().startsWith(pat));

      if (isStart) {
        capturing = true;
        continue;
      }
      if (isEnd && capturing) {
        capturing = false;
        break;
      }
      if (capturing) {
        contentLines.push(line);
      }
    }
    
    return contentLines.join("\n").trim() || "해당 섹션을 불러올 수 없습니다. 전체 문서를 참조해주세요.";
  };

  // Extract Section 4 (Channel Drafts) to pull specific channel contents
  const getChannelDraftText = (channelName: string) => {
    const lines = planText.split("\n");
    let capturing = false;
    let contentLines: string[] = [];

    // Different matching patterns for headings
    const startPatterns = [
      `### [${channelName}`,
      `### ${channelName}`,
      `[${channelName}]`,
      `**${channelName}**`,
      `* **${channelName}**`
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isStart = startPatterns.some(pat => line.includes(pat));
      
      if (isStart) {
        capturing = true;
        continue;
      }
      
      // Stop capturing if we hit another channel header or next main section
      if (capturing && (line.trim().startsWith("###") || line.trim().startsWith("##"))) {
        capturing = false;
        break;
      }
      
      if (capturing) {
        contentLines.push(line);
      }
    }

    return contentLines.join("\n").trim();
  };

  const sellingPoints = getSectionContent(1, 2);
  const diffPoints = getSectionContent(2, 3);
  const calendarText = getSectionContent(3, 4);
  const metricsProposal = getSectionContent(5, 6); // Up to end or 6

  // Set default mockup channel based on what they selected
  React.useEffect(() => {
    if (answers.step7 && answers.step7.length > 0 && !selectedMockupChannel) {
      setSelectedMockupChannel(answers.step7[0]);
    }
  }, [answers.step7, selectedMockupChannel]);

  // Clean Markdown formatter
  const renderFormattedMarkdown = (text: string) => {
    if (!text) return null;
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith("###")) {
        return (
          <h4 key={idx} className="font-sans font-bold text-slate-800 text-sm mt-5 mb-2 border-l-4 border-indigo-500 pl-2.5">
            {trimmed.replace(/###|\[|\]/g, "").trim()}
          </h4>
        );
      }
      if (trimmed.startsWith("##")) {
        return (
          <h3 key={idx} className="font-sans font-bold text-indigo-950 text-base mt-8 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-indigo-600 shrink-0" />
            {trimmed.replace(/##/g, "").trim()}
          </h3>
        );
      }
      if (trimmed.startsWith("#")) {
        return (
          <h2 key={idx} className="font-sans font-extrabold text-slate-900 text-lg mt-10 mb-5 text-center">
            {trimmed.replace(/#/g, "").trim()}
          </h2>
        );
      }

      // Bullet points
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        // Bold title within list
        const listContent = trimmed.substring(1).trim();
        const boldMatch = listContent.match(/^\*\*(.*?)\*\*:(.*)/);
        if (boldMatch) {
          return (
            <li key={idx} className="ml-4 list-disc text-xs text-slate-600 mb-2 leading-relaxed">
              <strong className="text-slate-800 font-semibold">{boldMatch[1]}:</strong>
              <span>{boldMatch[2]}</span>
            </li>
          );
        }
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-600 mb-2 leading-relaxed">
            {listContent}
          </li>
        );
      }

      // Empty line
      if (trimmed === "") {
        return <div key={idx} className="h-2" />;
      }

      // Regular paragraph
      return (
        <p key={idx} className="text-xs text-slate-600 leading-relaxed mb-2.5 break-all">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Panel */}
      <div className="liquid-glass border border-white/50 rounded-3xl p-6 md:p-8 text-slate-800 mb-8 shadow-md relative overflow-hidden">
        {/* Abstract background graphics */}
        <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-indigo-500/10 blur-xl" />
        <div className="absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-pink-500/10 blur-xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600/10 border border-indigo-500/30 rounded-full text-indigo-800 text-[11px] font-semibold mb-3">
              <ShieldCheck className="h-3 w-3" />
              10년 차 수석 마케터 AI 가이드 수립 완료
            </div>
            <h1 className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-slate-900 mb-2">
              최적화 웹툰 · 웹소설 IP 마케팅 제안서
            </h1>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              작품 장르(<span className="text-pink-600 font-bold">{answers.step1}</span>)와 
              캠페인 목표인 (<span className="text-indigo-600 font-bold">{answers.step0}</span>)를 정밀 조율하여 
              설계된 고효율 SNS 마케팅 기획안입니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleCopy}
              className="px-5 py-2.5 liquid-btn-primary text-white font-bold text-xs rounded-full shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  복사 완료!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  기획안 전체 복사
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 liquid-btn-secondary text-white font-bold text-xs rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              인쇄하기
            </button>
            <button
              onClick={onReset}
              className="px-5 py-2.5 liquid-btn-secondary text-white font-bold text-xs rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              처음부터 다시
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Menu Switcher */}
      <div className="flex bg-white/40 p-1.5 rounded-full mb-8 gap-1.5 max-w-xs border border-white/60 shadow-sm">
        <button
          onClick={() => setActiveTab("document")}
          className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "document"
              ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          정식 제안서
        </button>
        <button
          onClick={() => setActiveTab("mockups")}
          className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "mockups"
              ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          SNS 시각화
        </button>
      </div>

      {/* DOCUMENT TAB VIEW */}
      {activeTab === "document" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Proposal Column */}
          <div className="lg:col-span-2 liquid-glass rounded-3xl border border-white/50 p-6 md:p-8 shadow-sm">
            {/* Elegant Formal Watermark Banner */}
            <div className="border-b-2 border-double border-white/40 pb-5 mb-6 text-center">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
                IP MARKETING CAMPAIGN PLAN
              </span>
              <h2 className="font-sans font-black text-slate-900 text-lg tracking-tight">
                MARKETING PROPOSAL FOR "{answers.step1}" IP
              </h2>
            </div>

            {/* Generated Plan Render */}
            <div className="prose prose-indigo max-w-none space-y-2">
              {renderFormattedMarkdown(planText)}
            </div>
          </div>

          {/* Quick Stats & Structured Summary Side Column */}
          <div className="space-y-6">
            {/* Meta Block */}
            <div className="liquid-glass border border-white/50 rounded-2xl p-5">
              <h4 className="font-sans font-bold text-slate-900 text-xs tracking-wider uppercase mb-4 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                기본 타겟 스펙 데이터
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-white/40 pb-2">
                  <span className="text-slate-500 font-medium">플랫폼</span>
                  <span className="font-semibold text-slate-800">{answers.step2}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-white/40 pb-2">
                  <span className="text-slate-500 font-medium">타겟 연령층</span>
                  <span className="font-semibold text-slate-800">{answers.step3}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-white/40 pb-2">
                  <span className="text-slate-500 font-medium">연재 상태</span>
                  <span className="font-semibold text-slate-800">{answers.step4}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-white/40 pb-2">
                  <span className="text-slate-500 font-medium">보이스 톤</span>
                  <span className="font-semibold text-slate-800">{answers.step5}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">주 연재 요일</span>
                  <span className="font-semibold text-slate-800">{answers.step8}</span>
                </div>
              </div>
            </div>

            {/* Structured Weekly Calendar Block */}
            <div className="liquid-glass border border-white/50 rounded-2xl p-5 shadow-sm">
              <h4 className="font-sans font-bold text-slate-900 text-xs tracking-wider uppercase mb-3 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-pink-500" />
                정기 업로드 가이드
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                요일별 주요 이슈와 수집된 이벤트 일정이 완벽 조율되었습니다.
              </p>

              {/* Styled mini list */}
              <div className="space-y-2 text-xs">
                {calendarText.split("\n").filter(l => l.trim().startsWith("-")).slice(0, 7).map((line, idx) => {
                  const cleaned = line.replace(/^-|\*|\*\*|\[|\]/g, "").trim();
                  const parts = cleaned.split("/");
                  const day = parts[0]?.trim() || `${idx + 1}일`;
                  const channel = parts[1]?.trim() || "이슈 없음";
                  const subject = parts[2]?.trim() || "기타 마케팅";

                  return (
                    <div key={idx} className="flex items-start gap-2 bg-white/40 p-2 rounded-lg border border-white/50">
                      <span className="font-bold text-indigo-600 bg-white/60 border border-white/50 px-1.5 py-0.5 rounded text-[10px] uppercase shrink-0">
                        {day}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-700 truncate text-[11px]">{channel}</p>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{subject}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Competitor Differentiation Visual Card */}
            <div className="bg-gradient-to-br from-indigo-950 to-slate-950 border border-indigo-500/30 text-white rounded-2xl p-5 relative overflow-hidden shadow-md">
              <div className="absolute right-0 bottom-0 h-24 w-24 rounded-full bg-indigo-500/10 blur-xl" />
              <h4 className="font-sans font-bold text-xs tracking-wider uppercase mb-2.5 flex items-center gap-1.5 text-indigo-300">
                <TrendingUp className="h-4 w-4" />
                경쟁사 대비 핵심 우위 전략
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {diffPoints.split("\n")[0] || "독보적인 주인공 매력 및 사이다 전개를 극대화한 채널 마케팅을 제안합니다."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE MOCKUP WORKSPACE TAB */}
      {activeTab === "mockups" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Mockup Channels Selector Navigation */}
          <div className="lg:col-span-3 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider pl-2 mb-3">
              활성화된 채널 목록 ({answers.step7.length}개)
            </p>
            {answers.step7.map((channel) => {
              const isSelected = selectedMockupChannel === channel;
              
              const getChannelIcon = () => {
                if (channel.includes("인스타그램")) return <Instagram className="h-4 w-4" />;
                if (channel.includes("쇼츠") || channel.includes("유튜브 롱폼")) return <Youtube className="h-4 w-4" />;
                if (channel.includes("트위터")) return <Twitter className="h-4 w-4" />;
                if (channel.includes("카카오톡") || channel.includes("커뮤니티")) return <MessageSquare className="h-4 w-4" />;
                return <FileText className="h-4 w-4" />;
              };

              return (
                <button
                  key={channel}
                  onClick={() => setSelectedMockupChannel(channel)}
                  className={`w-full text-left flex items-center gap-2.5 px-4 py-3 rounded-full transition-all font-semibold text-xs border cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-md shadow-indigo-500/10"
                      : "bg-white/30 hover:bg-white/50 border-white/40 hover:border-white/60 text-slate-800 shadow-xs"
                  }`}
                >
                  {getChannelIcon()}
                  <span>{channel}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Mockup Preview Frame */}
          <div className="lg:col-span-9 liquid-glass rounded-3xl p-6 md:p-8 flex items-center justify-center border border-white/50 min-h-[500px]">
            {/* INSTAGRAM MOCKUP */}
            {selectedMockupChannel.includes("인스타그램") && (
              <div className="w-full max-w-sm bg-white/95 rounded-2xl border border-white shadow-lg overflow-hidden backdrop-blur-md">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 p-[1.5px]">
                      <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-[10px] font-black text-slate-800 uppercase font-mono">
                        IP
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 leading-none">@IP_Content_Marketer</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Sponsor Ad</p>
                    </div>
                  </div>
                  <span className="text-slate-800 font-bold tracking-tight text-xs pr-1">•••</span>
                </div>

                {/* Post Cover Screen */}
                <div className="bg-slate-900 aspect-square flex flex-col justify-between p-6 text-white relative">
                  {/* Subtle watermarks inside mockup */}
                  <div className="absolute inset-0 bg-radial-gradient from-indigo-900/15 via-transparent" />
                  
                  <div className="flex justify-between items-center relative z-10">
                    <span className="bg-indigo-600/95 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      {answers.step1} 추천
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{answers.step2}</span>
                  </div>

                  <div className="my-auto relative z-10 text-center px-4">
                    <p className="text-lg font-black tracking-tight text-slate-100 leading-snug">
                      {getChannelDraftText("인스타그램 카드뉴스").match(/페이지 타이틀:?\s*"(.*?)"/)
                        ? getChannelDraftText("인스타그램 카드뉴스").match(/페이지 타이틀:?\s*"(.*?)"/)?.[1]
                        : `신작 '${answers.step1}' 역대급 사이다 전개 오픈!`}
                    </p>
                    <p className="text-xxs text-pink-300 mt-2 font-medium">
                      {answers.step9 || "무료 회차 긴급 제공 이벤트 진행 중"}
                    </p>
                  </div>

                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-[10px] font-medium text-indigo-200">옆으로 넘겨보기 ➔</span>
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full" />
                      <span className="h-1.5 w-1.5 bg-slate-600 rounded-full" />
                      <span className="h-1.5 w-1.5 bg-slate-600 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Bottom Stats Row */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-red-500 font-bold text-sm">❤️</span>
                      <span className="text-slate-700 font-bold text-sm">💬</span>
                      <span className="text-slate-700 font-bold text-sm">✈️</span>
                    </div>
                    <span className="text-slate-700 text-xs">🔖</span>
                  </div>

                  <p className="text-[11px] font-bold text-slate-800 mb-1">좋아요 1,482개</p>

                  {/* Caption */}
                  <div className="text-[11px] text-slate-600 leading-relaxed pr-2 max-h-36 overflow-y-auto">
                    <strong className="text-slate-800 mr-1">@IP_Content_Marketer</strong>
                    {renderFormattedMarkdown(getChannelDraftText("인스타그램 카드뉴스") || `인스타그램 카드뉴스 전용 캡션 카피가 생성되었습니다. 전체 텍스트 탭을 참조해주세요.`)}
                  </div>
                </div>
              </div>
            )}

            {/* SHORTS / TIKTOK MOCKUP */}
            {selectedMockupChannel.includes("쇼츠") && (
              <div className="w-full max-w-[280px] bg-slate-950 aspect-[9/16] rounded-3xl border border-slate-850 shadow-2xl relative overflow-hidden flex flex-col justify-between p-4 text-white">
                {/* Visual Video Cover Background */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950" />
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <Youtube className="h-28 w-28 text-white" />
                </div>

                {/* Status Bar */}
                <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>● LIVE PLAYBACK</span>
                  <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[9px] font-bold tracking-tight">SHORTS</span>
                </div>

                {/* Script Overlay Box */}
                <div className="relative z-10 bg-slate-900/90 border border-slate-850 p-3.5 rounded-2xl max-h-[70%] overflow-y-auto mb-2 select-none">
                  <p className="text-[10px] uppercase tracking-widest text-pink-400 font-bold mb-1.5">🎬 Shorts 0~3초 오프닝 훅</p>
                  <p className="text-xs font-black text-white leading-relaxed mb-3">
                    {getChannelDraftText("틱톡/유튜브 쇼츠").match(/오프닝 훅:?\s*"(.*?)"/)
                      ? getChannelDraftText("틱톡/유튜브 쇼츠").match(/오프닝 훅:?\s*"(.*?)"/)?.[1]
                      : "잠깐! 요즘 완결 정주행 대세작, 아직도 안 보셨다구요?!"}
                  </p>
                  
                  <p className="text-[9px] uppercase tracking-widest text-indigo-400 font-bold mb-1">⏰ 타임라인 씬</p>
                  <div className="text-[10px] text-slate-300 space-y-1.5 leading-relaxed font-mono">
                    {getChannelDraftText("틱톡/유튜브 쇼츠") ? (
                      <div className="whitespace-pre-wrap text-[10px]">
                        {getChannelDraftText("틱톡/유튜브 쇼츠").slice(0, 300)}...
                      </div>
                    ) : (
                      <p className="italic text-slate-500">대본 및 화면 연출 힌트가 구성되었습니다. 전체 텍스트 탭을 확인해 주세요.</p>
                    )}
                  </div>
                </div>

                {/* Bottom User Row */}
                <div className="relative z-10 flex justify-between items-end">
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-xs font-bold text-white">@IP_Marketer_PRO</p>
                    <p className="text-[10px] text-slate-300 truncate mt-1">
                      {answers.step0}를 저격하는 독점 후킹 숏폼
                    </p>
                    <p className="text-[9px] text-pink-400 mt-0.5">🎵 오리지널 사운드트랙 - {answers.step1}</p>
                  </div>

                  {/* Sidebar engagement buttons */}
                  <div className="flex flex-col items-center gap-3.5 shrink-0">
                    <div className="text-center">
                      <span className="text-lg">🔥</span>
                      <p className="text-[9px] text-slate-300 mt-0.5">8.9K</p>
                    </div>
                    <div className="text-center">
                      <span className="text-lg">💬</span>
                      <p className="text-[9px] text-slate-300 mt-0.5">492</p>
                    </div>
                    <div className="text-center">
                      <span className="text-lg">⭐</span>
                      <p className="text-[9px] text-slate-300 mt-0.5">Share</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LONGFORM YOUTUBE MOCKUP */}
            {selectedMockupChannel.includes("유튜브 롱폼") && (
              <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                {/* Youtube Banner Frame */}
                <div className="bg-slate-900 aspect-video flex flex-col justify-between p-4 text-white relative">
                  <div className="absolute inset-0 bg-radial-gradient from-red-600/10 via-transparent" />
                  
                  {/* Playing State Overlay */}
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span className="bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">Longform Preview</span>
                    <span>10:24</span>
                  </div>

                  <div className="text-center px-6 my-auto">
                    <h3 className="font-bold text-sm tracking-tight leading-relaxed mb-2 text-slate-100">
                      🎥 [영상 제안 썸네일 카피]
                    </h3>
                    <p className="text-xs font-semibold text-amber-300 bg-slate-950/60 inline-block px-3 py-1.5 rounded-xl border border-amber-400/20">
                      {getChannelDraftText("유튜브 롱폼").match(/썸네일 문구 제안:?\s*"(.*?)"/)
                        ? getChannelDraftText("유튜브 롱폼").match(/썸네일 문구 제안:?\s*"(.*?)"/)?.[1]
                        : `"${answers.step1} 장르를 완전히 씹어먹은 사이다 역작!"`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
                    <span>플레이 중: 챕터 및 스토리 분석 연출 영상</span>
                  </div>
                </div>

                {/* Subtitle / Chapter Information */}
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">🎞️ 챕터별 주요 타임라인 및 분석</h4>
                  <div className="text-[11px] text-slate-600 leading-relaxed max-h-32 overflow-y-auto">
                    {renderFormattedMarkdown(getChannelDraftText("유튜브 롱폼") || `롱폼 전용 상세 타임라인 정보가 생성되었습니다. 전체 텍스트 탭을 확인해 주세요.`)}
                  </div>
                </div>
              </div>
            )}

            {/* TWITTER / X MOCKUP */}
            {selectedMockupChannel.includes("트위터") && (
              <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-250 p-5 shadow-lg">
                {/* Profile row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black font-mono text-sm">
                      X
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-extrabold text-slate-900 leading-none">IP 마케팅 수석 가이드</span>
                        {/* Twitter blue badge */}
                        <span className="text-[10px] text-indigo-500">✓</span>
                      </div>
                      <span className="text-[10px] text-slate-400 leading-none">@IP_Marketer_PRO</span>
                    </div>
                  </div>
                  <span className="text-slate-400 font-bold text-xs">•••</span>
                </div>

                {/* Tweet content */}
                <div className="text-xs text-slate-800 leading-relaxed mb-4 whitespace-pre-wrap">
                  {getChannelDraftText("X(트위터)") || `X(트위터)용 실시간 전파력 높은 스레드 카피가 준비되었습니다.`}
                </div>

                {/* Meta details */}
                <div className="border-t border-b border-slate-100 py-2.5 mb-3 flex items-center gap-4 text-[10px] font-mono text-slate-400">
                  <span>오후 11:32 · 2026년 7월 6일</span>
                  <span>·</span>
                  <span className="font-bold text-slate-700">12.5K</span>
                  <span>조회</span>
                </div>

                {/* Interaction counters */}
                <div className="flex items-center justify-between px-2 text-slate-500 text-sm">
                  <span className="hover:text-sky-500 cursor-pointer">💬 142</span>
                  <span className="hover:text-emerald-500 cursor-pointer">🔁 2,394</span>
                  <span className="hover:text-pink-500 cursor-pointer">❤️ 4.9K</span>
                  <span className="hover:text-sky-500 cursor-pointer">🔖 82</span>
                  <span className="hover:text-sky-500 cursor-pointer">📤</span>
                </div>
              </div>
            )}

            {/* BLOG SEO MOCKUP */}
            {selectedMockupChannel.includes("블로그") && (
              <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden text-xs">
                {/* Portal search mock header */}
                <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-full px-3 py-1 flex-1 text-[10px] text-slate-400 font-mono truncate">
                    https://blog.naver.com/ip_marketer_pro/post_20260706
                  </div>
                </div>

                {/* Editorial Blog Container */}
                <div className="p-5 max-h-[380px] overflow-y-auto">
                  <div className="border-b border-slate-100 pb-4 mb-4">
                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {getChannelDraftText("블로그(SEO)").match(/제목:?\s*"(.*?)"/)
                        ? getChannelDraftText("블로그(SEO)").match(/제목:?\s*"(.*?)"/)?.[1]
                        : `[${answers.step1} 추천] 독점 연재 플랫폼 '${answers.step2}' 화제작 심층 리뷰`}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-2">작성자: 수석 IP 분석가 · 2026. 07. 06</p>
                  </div>

                  <div className="space-y-4 text-slate-600 leading-relaxed">
                    {renderFormattedMarkdown(getChannelDraftText("블로그(SEO)") || `상세 블로그 SEO 구성안이 수집되었습니다. 전체 문서 탭을 확인해주세요.`)}
                  </div>
                </div>
              </div>
            )}

            {/* KAKAO TALK MOCKUP */}
            {(selectedMockupChannel.includes("카카오톡") || selectedMockupChannel.includes("커뮤니티")) && (
              <div className="w-full max-w-xs bg-sky-200 aspect-[3/4] rounded-2xl border border-slate-300 shadow-lg flex flex-col p-4">
                {/* Chat header */}
                <div className="flex items-center gap-2 pb-3 border-b border-sky-300/40 text-slate-800 font-bold text-xs">
                  <span>◀</span>
                  <span>IP 공식 알림 채널</span>
                </div>

                {/* Chat Area */}
                <div className="flex-1 py-4 flex flex-col justify-end">
                  {/* Yellow push block */}
                  <div className="bg-yellow-50 rounded-2xl border border-yellow-100 shadow-sm p-3 max-w-[90%] self-start relative">
                    <div className="flex items-center gap-1.5 mb-1.5 text-slate-700 font-bold text-[10px] border-b border-yellow-200 pb-1">
                      <span className="text-yellow-500">●</span>
                      <span>[알림톡] 특별 혜택 및 연재 공지</span>
                    </div>

                    <p className="text-xs text-slate-800 leading-relaxed font-sans mb-3">
                      {getChannelDraftText("카카오톡 채널/커뮤니티용 짧은 공지형 카피") || `카카오톡 채널 및 커뮤니티 전용 후킹형 컴팩트 카피입니다.`}
                    </p>

                    <div className="bg-yellow-100 hover:bg-yellow-200 cursor-pointer transition-all rounded-xl p-2 text-center text-[10px] font-bold text-yellow-900 border border-yellow-200 flex items-center justify-center gap-1">
                      <span>지금 바로 정주행 하러 가기</span>
                      <span>➔</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Warning constraint checker banner */}
      <div className="liquid-glass border border-white/50 rounded-2xl p-4.5 mt-8 flex items-start gap-3 shadow-xs">
        <AlertCircle className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-950">할루시네이션(임의 창작) 및 채널 필터링 방지 검증</p>
          <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
            제안서는 오직 입력된 정보({answers.step6})만을 기준으로 작성되었으며, 사용하지 않은 채널은 완벽하게 생략되었습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
