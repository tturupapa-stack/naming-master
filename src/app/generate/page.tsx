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
    if (score >= 90) return "text-green-700 bg-green-100";
    if (score >= 80) return "text-orange-700 bg-orange-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent"
          >
            네이밍 마스터
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">
              오늘 {usageCount}/3회 사용
            </span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < usageCount ? "bg-orange-400" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Input Form */}
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 md:p-8 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            상품명 생성하기
          </h1>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              상품 카테고리 <span className="text-orange-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all"
            >
              <option value="">카테고리를 선택하세요</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Keywords */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              핵심 키워드 <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="예: 유기농 그래놀라, 견과류 시리얼"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all"
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
                <input
                  key={i}
                  type="text"
                  value={feat}
                  onChange={(e) => updateFeature(i, e.target.value)}
                  placeholder={
                    [
                      "예: 500g 대용량",
                      "예: 무설탕, 무첨가",
                      "예: 아침식사 대용",
                    ][i]
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all"
                />
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-lg font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
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

        {/* Loading Skeleton */}
        {loading && (
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 md:p-8 mb-8">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer w-3/4" />
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <div className="h-6 w-16 bg-gray-200 rounded-full" />
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                생성된 상품명
              </h2>
              <button
                onClick={copyAll}
                className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                {copiedAll ? "복사 완료!" : "전체 복사"}
              </button>
            </div>

            <div className="space-y-3">
              {results.map((result, i) => (
                <div
                  key={i}
                  className="group p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-200 animate-fade-in-up"
                  style={{ animationDelay: `${i * 50}ms`, opacity: 0 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400 font-medium shrink-0">
                          #{i + 1}
                        </span>
                        <span className="text-gray-800 font-medium text-sm md:text-base break-all">
                          {result.name}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-xs text-gray-400">
                          {result.name.length}자
                        </span>
                        <span className="text-gray-200">|</span>
                        {result.keywords.slice(0, 4).map((kw, ki) => (
                          <span
                            key={ki}
                            className="text-xs px-1.5 py-0.5 bg-white border border-gray-200 text-gray-500 rounded"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getScoreColor(
                          result.seoScore
                        )}`}
                      >
                        SEO {result.seoScore}
                      </span>
                      <button
                        onClick={() => copyToClipboard(result.name, i)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
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

        {/* Premium Upsell Banner */}
        {(limitReached || usageCount >= 2) && (
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-6 md:p-8 text-white mb-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold mb-1">
                  {limitReached
                    ? "오늘의 무료 사용 횟수를 모두 사용했습니다"
                    : "더 많은 상품명이 필요하신가요?"}
                </h3>
                <p className="text-orange-100 text-sm">
                  프리미엄 플랜으로 업그레이드하면 무제한으로 상품명을 생성할 수 있습니다.
                </p>
              </div>
              <button className="shrink-0 px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-sm">
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
          <h3 className="text-lg font-bold text-gray-900 mb-4">
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
            className="font-medium bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent"
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
