import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateRequest {
  category: string;
  keywords: string;
  features: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { category, keywords, features } = body;

    if (!category || !keywords) {
      return NextResponse.json(
        { error: "카테고리와 키워드는 필수 입력 항목입니다." },
        { status: 400 }
      );
    }

    const featuresText = features.filter(Boolean).join(", ");

    const prompt = `당신은 쿠팡과 네이버 스마트스토어 상품명 SEO 전문가입니다.

다음 상품 정보를 기반으로 검색 최적화된 상품명 10개를 생성해주세요.

## 상품 정보
- 카테고리: ${category}
- 핵심 키워드: ${keywords}
${featuresText ? `- 특징/장점: ${featuresText}` : ""}

## 상품명 생성 규칙
1. 쿠팡/네이버 검색 알고리즘 최적화: 핵심 키워드를 상품명 앞쪽에 배치
2. 50자 이내 권장 (최대 100자)
3. 패턴: [수식어] + 핵심키워드 + 상품특징 + 용량/수량/규격
4. 클릭률 높은 수식어 활용: 프리미엄, 인기, 베스트, 1+1, 대용량, 국내산, 무료배송 등
5. 자연스러운 한국어 표현
6. 각 상품명은 서로 다른 키워드 조합과 수식어 사용
7. 실제 쿠팡/스마트스토어에서 잘 팔리는 상품명 스타일 참고

## 응답 형식
반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.

[
  {
    "name": "상품명",
    "keywords": ["포함된", "주요", "키워드"],
    "seoScore": 85
  }
]

seoScore는 70~100 사이 정수로, 다음 기준으로 채점:
- 핵심 키워드 포함 여부 (30점)
- 키워드 앞배치 여부 (20점)
- 적절한 글자수 (20점)
- 수식어 활용 (15점)
- 구매 전환 유도 표현 (15점)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "당신은 한국 이커머스 플랫폼(쿠팡, 네이버 스마트스토어) 상품명 SEO 전문가입니다. JSON 형식으로만 응답합니다.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "AI 응답을 받지 못했습니다. 다시 시도해주세요." },
        { status: 500 }
      );
    }

    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = content.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const results = JSON.parse(jsonStr);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Generation error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "AI 응답을 파싱하지 못했습니다. 다시 시도해주세요." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "상품명 생성 중 오류가 발생했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
