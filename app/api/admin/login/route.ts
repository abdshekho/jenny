import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"


const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { email, role: "admin" },
        JWT_SECRET,
        { expiresIn: "24h" }
      )

      return NextResponse.json({
        success: true,
        token,
        message: "تم تسجيل الدخول بنجاح"
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "الإيميل أو كلمة المرور غير صحيحة"
      }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "حدث خطأ في الخادم"
    }, { status: 500 })
  }
}