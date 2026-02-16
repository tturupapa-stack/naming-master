"use client";

import Link from "next/link";

const FEATURES = [
  {
    icon: "🎯",
    title: "검색 알고리즘 최적화",
    description: "쿠팡, 네이버 스마트스토어의 검색 로직에 맞춰 상위 노출되는 상품명을 생성합니다.",
  },
  {
    icon: "⚡",
    title: "10개 상품명 즉시 생성",
    description: "한 번의 클릭으로 SEO 최적화된 상품명 10개를 바로 받아보세요.",
  },
  {
    icon: "📊",
    title: "SEO 점수 분석",
    description: "각 상품명의 글자수, 키워드 배치, SEO 점수를 한눈에 확인할 수 있습니다.",
  },
  {
    icon: "📋",
    title: "원클릭 복사",
    description: "마음에 드는 상품명을 클릭 한 번으로 복사하여 바로 등록할 수 있습니다.",
  },
];

const STEPS = [
  { step: "1", title: "상품 정보 입력", description: "카테고리, 키워드, 특징을 입력하세요" },
  { step: "2", title: "AI가 분석 & 생성", description: "검색 알고리즘 기반 최적화" },
  { step: "3", title: "상품명 선택 & 복사", description: "SEO 점수를 확인하고 바로 사용" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-orange-50/20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            aria-label="네이밍 마스터 홈으로 이동"
            className="text-xl font-extrabold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-md"
          >
            네이밍 마스터
          </Link>
          <Link
            href="/generate"
            aria-label="상품명 생성 페이지로 이동"
            className="px-5 py-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-full text-sm font-medium hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            무료로 시작하기
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-sm text-orange-700 font-medium mb-6">
            쿠팡 & 스마트스토어 셀러를 위한 AI 도구
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight text-balance">
            매출을 올리는
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
              AI 상품명 생성기
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            쿠팡, 네이버 스마트스토어 검색 알고리즘에 최적화된
            <br className="hidden md:block" />
            상품명을 AI가 자동으로 만들어 드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/generate"
              aria-label="상품명 만들기 시작"
              className="px-8 py-4 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-2xl text-lg font-semibold hover:shadow-xl hover:shadow-orange-200 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              상품명 만들기 →
            </Link>
            <a
              href="#features"
              aria-label="주요 기능 섹션으로 이동"
              className="px-8 py-4 bg-white border-2 border-orange-200 text-orange-700 rounded-2xl text-lg font-semibold hover:bg-orange-50 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              자세히 알아보기
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-400">무료 하루 3회 · 회원가입 없이 바로 사용</p>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/50 border border-orange-100 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-sm text-gray-400">네이밍 마스터</span>
            </div>
            <div className="space-y-3">
              {[
                { name: "[프리미엄] 유기농 그래놀라 견과류 아사이볼 토핑 500g 대용량", score: 95 },
                { name: "인기 베스트 유기농 그래놀라 오트밀 견과류 아사이볼 간식", score: 92 },
                { name: "유기농 그래놀라 프리미엄 견과류 오트밀 아침식사 500g", score: 88 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-orange-50 hover:border-orange-200 transition-colors">
                  <span className="text-gray-800 text-sm md:text-base font-medium">{item.name}</span>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold border border-emerald-200">
                      SEO {item.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gradient-to-b from-orange-50/50 to-transparent">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-4">
            사용 방법
          </h2>
          <p className="text-gray-500 text-center mb-12 pb-8 border-b border-orange-100">
            3단계로 간단하게 최적의 상품명을 만들어보세요
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-4">
            왜 네이밍 마스터인가요?
          </h2>
          <p className="text-gray-500 text-center mb-12 pb-8 border-b border-orange-100">
            데이터 기반 AI가 만드는 검증된 상품명
          </p>
          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="p-5 md:p-6 bg-white rounded-2xl border border-orange-100 hover:shadow-lg hover:shadow-orange-50 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl p-10 md:p-16 text-white">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-orange-100 mb-8 text-lg">
              회원가입 없이 무료로 상품명을 만들어보세요
            </p>
            <Link
              href="/generate"
              aria-label="무료로 상품명 만들기 시작"
              className="inline-block px-8 py-4 bg-white text-orange-700 rounded-2xl text-lg font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              무료로 상품명 만들기 →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-orange-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span className="font-medium bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
            네이밍 마스터
          </span>
          <span>&copy; {new Date().getFullYear()} 네이밍 마스터. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
