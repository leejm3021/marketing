import React from "react";
import { SurveyAnswers } from "../types";
import { STEPS } from "../data";
import { BookOpen, Target, Smartphone, Users, Sparkles, TrendingUp, Megaphone, Calendar, Gift, FileText, ClipboardList } from "lucide-react";

interface LiveSummarySidebarProps {
  answers: SurveyAnswers;
}

export default function LiveSummarySidebar({ answers }: LiveSummarySidebarProps) {
  // Map icon names to lucide components
  const getIcon = (key: string) => {
    switch (key) {
      case "step0": return <Target className="h-4 w-4 text-indigo-500" />;
      case "step1": return <BookOpen className="h-4 w-4 text-pink-500" />;
      case "step2": return <Smartphone className="h-4 w-4 text-blue-500" />;
      case "step3": return <Users className="h-4 w-4 text-purple-500" />;
      case "step4": return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case "step5": return <Sparkles className="h-4 w-4 text-amber-500" />;
      case "step6": return <FileText className="h-4 w-4 text-orange-500" />;
      case "step7": return <Megaphone className="h-4 w-4 text-cyan-500" />;
      case "step8": return <Calendar className="h-4 w-4 text-teal-500" />;
      case "step9": return <Gift className="h-4 w-4 text-red-500" />;
      default: return <ClipboardList className="h-4 w-4 text-slate-400" />;
    }
  };

  const hasAnyAnswers = Object.values(answers).some(val => 
    Array.isArray(val) ? val.length > 0 : val !== ""
  );

  return (
    <div className="liquid-glass rounded-2xl p-5 shadow-sm sticky top-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/30">
        <ClipboardList className="h-5 w-5 text-indigo-600" />
        <h3 className="font-sans font-bold text-slate-900 text-xs tracking-wider uppercase">
          실시간 마케팅 세팅 보드
        </h3>
      </div>

      {!hasAnyAnswers ? (
        <div className="py-12 text-center">
          <p className="text-xs text-slate-400 leading-relaxed px-4">
            질문에 답변을 채우시면 실시간으로 마케팅 믹스 보드가 여기에 자동 작성됩니다.
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
          {STEPS.map((step) => {
            const rawValue = answers[step.key];
            const hasValue = Array.isArray(rawValue) ? rawValue.length > 0 : rawValue !== "";
            const valueDisplay = Array.isArray(rawValue) 
              ? rawValue.join(", ") 
              : rawValue;

            return (
              <div key={step.key} className="group transition-all duration-200">
                <div className="flex items-center gap-2 mb-1.5">
                  {getIcon(step.key)}
                  <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase">
                    {step.title.split(".")[0].toUpperCase()}
                  </span>
                </div>
                
                <div className="pl-6">
                  {hasValue ? (
                    <div className="bg-white/40 border border-white/50 rounded-xl p-2.5 transition-all group-hover:border-white/70">
                      <p className="text-xs font-semibold text-slate-800 leading-relaxed break-words">
                        {valueDisplay}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-300 italic pl-1">
                      답변 대기 중...
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
