"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

interface GeneratedName {
  name: string;
  keywords: string[];
  seoScore: number;
}

const CATEGORIES = [
  "식품/건강식품",
  "뷰티/화장품",
  "패션/의류",
  "생활용품",
  "가전/디지털",
  "유아/아동",
  "반려동물",
  "스포츠/레저",
  "가구/인테리어",
  "자동차용품",
  "문구/오피스",
  "기타",
];

function getUsageCount(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem("naming-master-usage");
  if (!stored) return 0;
  const data = JSON.parse(stored);
  const today = new Date().toISOString().split("T")[0];
  if (data.date !== today) return 0;
  return data.count;
}

function incrementUsage(): void {
  const today = new Date().toISOString().split("T")[0];
  const current = getUsageCount();
  localStorage.setItem(
    "naming-master-usage",
    JSON.stringify({ date: today, count: current + 1 })
  );
}

export default function GeneratePage() {
  const [category, setCategory] = useState("");
  const [keywords, setKeywords] = useState("");
  const [features, setFeatures] = useState(["", "", ""]);
  const [results, setResults] = useState<GeneratedName[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    setUsageCount(getUsageCount());
  }, []);

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleGenerate = useCallback(async () => {
    if (!category) {
      setError("상품 카테고리를 선택해주세요.");
      return;
    }
    if (!keywords.trim()) {
      setError("핵심 키워드를 입력해주세요.");
      return;
    }

    const currentUsage = getUsageCount();
    if (currentUsage >= 3) {
      setLimitReached(true);
      return;
    }

    setError("");
    setLoading(true);
    setResults([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          keywords: keywords.trim(),
          features: features.filter(Boolean),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "오류가 발생했습니다.");
        return;
      }

      setResults(data.results);
      incrementUsage();
      setUsageCount(getUsageCount());
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, [category, keywords, features]);

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = async () => {
    const allNames = results.map((r) => r.name).join("\n");
    await navigator.clipboard.writeText(allNames);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-700 bg-emerald-100 border-emerald-300";
    if (score >= 85) return "text-amber-700 bg-amber-100 border-amber-300";
    if (score >= 80) return "text-orange-700 bg-orange-100 border-orange-300";
    return "text-gray-600 bg-gray-100 border-gray-200";
  };

  const canGenerate = usageCount < 3;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/60 via-[var(--background)] to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="네이밍 마스터 홈으로 이동"
            className="text-xl font-extrabold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-md"
          >
            네이밍 마스터
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm text-gray-500">
              오늘 {usageCount}/3회 사용
            </span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    i <= usageCount
                      ? "bg-orange-400 border-orange-400 text-white"
                      : "bg-white border-orange-200 text-transparent"
                  }`}
                >
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 010 1.42l-7.2 7.2a1 1 0 01-1.415 0l-3-3a1 1 0 011.414-1.42l2.293 2.294 6.493-6.494a1 1 0 011.415 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Input Form */}
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 md:p-8 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            상품명 생성하기
          </h1>
          <p className="text-sm text-gray-500 mb-6 pb-6 border-b border-orange-100">
            카테고리와 키워드를 입력하면 SEO 점수 기반 상품명 10개를 생성합니다.
          </p>

          {/* Category */}
          <div className="mb-6">
            <p className="block text-sm font-semibold text-gray-700 mb-3">
              상품 카테고리 <span className="text-orange-500">*</span>
            </p>
            <div
              role="radiogroup"
              aria-label="상품 카테고리 선택"
              className="grid grid-cols-2 sm:grid-cols-3 gap-2"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="radio"
                  aria-label={`${cat} 카테고리 선택`}
                  aria-checked={category === cat}
                  onClick={() => setCategory(cat)}
                  className={`relative text-left px-3 py-2.5 rounded-xl border transition-all duration-200 text-sm ${
                    category === cat
                      ? "bg-orange-50 border-orange-300 text-orange-900 ring-2 ring-orange-400"
                      : "bg-white border-gray-200 text-gray-700 hover:border-orange-200"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400`}
                >
                  <span className="pr-6 block truncate">{cat}</span>
                  {category === cat && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-orange-400 text-white flex items-center justify-center">
                      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M16.704 5.29a1 1 0 010 1.42l-7.2 7.2a1 1 0 01-1.415 0l-3-3a1 1 0 011.414-1.42l2.293 2.294 6.493-6.494a1 1 0 011.415 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="mb-6">
            <label htmlFor="keywords" className="block text-sm font-semibold text-gray-700 mb-2">
              핵심 키워드 <span className="text-orange-500">*</span>
            </label>
            <input
              id="keywords"
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              aria-label="핵심 키워드 입력"
              placeholder="예: 유기농 그래놀라, 견과류 시리얼"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:border-transparent transition-all"
            />
            <p className="mt-1.5 text-xs text-gray-400">
              상품의 핵심 키워드를 쉼표로 구분하여 입력하세요
            </p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              특징/장점 (최대 3개)
            </label>
            <div className="space-y-3">
              {features.map((feat, i) => (
                <div key={i}>
                  <label htmlFor={`feature-${i}`} className="sr-only">
                    특징 {i + 1} 입력
                  </label>
                  <input
                    id={`feature-${i}`}
                    type="text"
                    value={feat}
                    onChange={(e) => updateFeature(i, e.target.value)}
                    aria-label={`특징 ${i + 1} 입력`}
                    placeholder={
                      [
                        "예: 500g 대용량",
                        "예: 무설탕, 무첨가",
                        "예: 아침식사 대용",
                      ][i]
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:border-transparent transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              aria-live="polite"
              className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-2"
            >
              <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M18 10A8 8 0 114 4.004V4a8 8 0 0114 6zm-8-3a1 1 0 00-.867.503l-2 3.5A1 1 0 008 12h4a1 1 0 00.867-1.497l-2-3.5A1 1 0 0010 7zm0 7a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Generate Button */}
          <div className="pt-6 border-t border-orange-100">
            {!canGenerate && (
              <p className="mb-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                오늘 무료 3회 사용을 모두 완료했습니다. 내일 다시 시도하거나 프리미엄을 이용해주세요.
              </p>
            )}
            <p className="mb-3 text-xs text-gray-500">오늘 남은 무료 생성: {Math.max(0, 3 - usageCount)}회</p>
          <button
            onClick={handleGenerate}
            disabled={loading || !canGenerate}
            aria-label="상품명 10개 생성하기"
            className="w-full py-4 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-xl text-lg font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            {loading ? (
              <span aria-live="polite" className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                AI가 상품명을 생성하고 있습니다...
              </span>
            ) : (
              "상품명 10개 생성하기"
            )}
          </button>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 md:p-8 mb-8">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-orange-100">
              <h2 className="text-xl font-extrabold text-gray-900">생성 중...</h2>
              <span className="text-xs text-gray-500">10개 상품명 준비 중</span>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex-1 min-w-0">
                      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer w-4/5 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-2/5" />
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <div className="h-6 w-16 bg-gray-200 rounded-full border border-gray-300" />
                      <div className="h-8 w-12 bg-white rounded-lg border border-gray-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 md:p-8 mb-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-orange-100">
              <h2 className="text-2xl font-extrabold text-gray-900">
                생성된 상품명
              </h2>
              <button
                onClick={copyAll}
                aria-label="생성된 상품명 전체 복사"
                className="px-4 py-2 text-sm font-semibold text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                {copiedAll ? "복사 완료!" : "전체 복사"}
              </button>
            </div>

            <div className="space-y-3">
              {results.map((result, i) => (
                <div
                  key={i}
                  className={`group p-4 rounded-xl border transition-all duration-200 animate-fade-in-up ${
                    i < 3
                      ? "bg-orange-50/60 border-orange-200 ring-2 ring-orange-400/20 hover:ring-orange-400/40"
                      : "bg-gray-50 border-gray-200 hover:bg-orange-50 hover:border-orange-200"
                  } hover:shadow-md hover:-translate-y-0.5`}
                  style={{ animationDelay: `${i * 50}ms`, opacity: 0 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-gray-500 font-semibold shrink-0">
                          {i < 3 ? `TOP ${i + 1}` : `#${i + 1}`}
                        </span>
                        <span className="text-gray-900 font-semibold text-sm md:text-base break-all">
                          {result.name}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">
                          {result.name.length}자
                        </span>
                        <span className="text-gray-200">|</span>
                        {result.keywords.slice(0, 4).map((kw, ki) => (
                          <span
                            key={ki}
                            className="text-xs px-2 py-1 bg-white border border-orange-200 text-orange-700 rounded-md"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-start">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${getScoreColor(
                          result.seoScore
                        )}`}
                      >
                        SEO {result.seoScore}
                      </span>
                      <button
                        onClick={() => copyToClipboard(result.name, i)}
                        aria-label={`${i + 1}번째 상품명 복사`}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                      >
                        {copiedIndex === i ? "복사됨!" : "복사"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 md:p-8 mb-8">
            <div className="text-center py-8">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-orange-50 border border-orange-200 text-orange-500 flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-1">아직 생성된 결과가 없습니다</h2>
              <p className="text-sm text-gray-500">
                카테고리와 키워드를 입력한 뒤 생성 버튼을 눌러 상품명 10개를 받아보세요.
              </p>
            </div>
          </div>
        )}

        {/* Premium Upsell Banner */}
        {(limitReached || usageCount >= 2) && (
          <div className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl p-6 md:p-8 text-white mb-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold mb-1">
                  {limitReached
                    ? "오늘의 무료 사용 횟수를 모두 사용했습니다"
                    : "더 많은 상품명이 필요하신가요?"}
                </h3>
                <p className="text-orange-100 text-sm">
                  프리미엄 플랜으로 업그레이드하면 무제한으로 상품명을 생성할 수 있습니다.
                </p>
              </div>
              <button
                aria-label="프리미엄 시작하기"
                className="shrink-0 px-6 py-3 bg-white text-orange-700 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                프리미엄 시작하기 →
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-orange-400/30 grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="font-bold text-lg">무제한</div>
                <div className="text-orange-100">상품명 생성</div>
              </div>
              <div>
                <div className="font-bold text-lg">고급 분석</div>
                <div className="text-orange-100">키워드 리포트</div>
              </div>
              <div>
                <div className="font-bold text-lg">경쟁사</div>
                <div className="text-orange-100">상품명 분석</div>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-orange-50/50 rounded-2xl border border-orange-100 p-6 md:p-8">
          <h3 className="text-xl font-extrabold text-gray-900 mb-4 pb-3 border-b border-orange-100">
            상품명 작성 팁
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">
              <span className="text-orange-500 shrink-0">1.</span>
              <span>
                <strong>핵심 키워드를 앞쪽에 배치</strong>하세요. 검색 알고리즘은 앞쪽
                키워드에 더 높은 가중치를 부여합니다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 shrink-0">2.</span>
              <span>
                <strong>50자 이내</strong>가 이상적입니다. 너무 길면 검색결과에서
                잘려 보입니다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 shrink-0">3.</span>
              <span>
                <strong>수식어를 활용</strong>하세요. &quot;프리미엄&quot;, &quot;인기&quot;, &quot;베스트&quot; 같은
                단어가 클릭률을 높입니다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 shrink-0">4.</span>
              <span>
                <strong>용량/수량 정보를 포함</strong>하세요. 고객이 비교 구매 시
                중요한 정보입니다.
              </span>
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-orange-100 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <Link
            href="/"
            aria-label="네이밍 마스터 홈으로 이동"
            className="font-medium bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-md"
          >
            네이밍 마스터
          </Link>
          <span>
            &copy; {new Date().getFullYear()} 네이밍 마스터. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
