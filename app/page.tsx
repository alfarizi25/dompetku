import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Shield, TrendingUp, PiggyBank, CreditCard, CheckCircle, Star, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10" />

        {/* Navigation */}
        <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
  <div className="flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center space-x-2">
      <img src="/favicon.ico" alt="DompetKu" className="w-10 h-10" />
      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        DompetKu
      </span>
    </div>

    {/* Menu */}
    <div className="hidden md:flex items-center space-x-8">
      <Link
        href="#features"
        className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-medium transition-all duration-300 hover:opacity-80"
      >
        Fitur
      </Link>
      <Link
        href="#testimonials"
        className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-medium transition-all duration-300 hover:opacity-80"
      >
        Testimoni
      </Link>
      <Link href="/login">
        <Button
          size="sm"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300"
        >
          Masuk
        </Button>
      </Link>
    </div>
  </div>
</nav>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Atur Finansial, {" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Hidup Lebih Tenang 
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            DompetKu bikin catat duit harian sampai rencana tabungan jadi gampang. Bebas pusing, tinggal catat, beres!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/register">
              <Button
  size="lg"
  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300 animate-scale-in px-8 py-3"
>
  Mulai Sekarang Gratis
  <ArrowRight className="ml-2 h-5 w-5" />
</Button>
              </Link>
              <Link href="/login">
              <Button
  variant="outline"
  size="lg"
  className="relative transition-all duration-300 px-8 py-3 bg-transparent font-semibold
             bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text 
             before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-blue-600 before:to-indigo-600 before:content-[''] before:-z-10
             hover:bg-blue-50/30"
>
  Masuk ke Akun
</Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>100% Aman</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-primary" />
                <span>10,000+ Pengguna</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-primary" />
                <span>Rating 4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Semua Fitur yang Kamu Butuhin</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Dari nyatet pengeluaran sampai nabung buat masa depan—semua ada di DompetKu, gampang banget dipakai.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card p-6 hover:shadow-lg transition-all duration-300 animate-slide-up border-border">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Catat Pengeluaran Harian</h3>
            <p className="text-muted-foreground text-sm">
            Nulis duit masuk & keluar jadi simpel. Ada kategorinya, ada laporannya, semua rapi.
            </p>
          </Card>

          <Card
            className="bg-card p-6 hover:shadow-lg transition-all duration-300 animate-slide-up border-border"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Ingetin Hutang Otomatis</h3>
            <p className="text-muted-foreground text-sm">
            Catat siapa yang ngutang, berapa jumlahnya, dan DompetKu yang bakal ingetin jatuh temponya.
            </p>
          </Card>

          <Card
            className="bg-card p-6 hover:shadow-lg transition-all duration-300 animate-slide-up border-border"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
              <PiggyBank className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Nabung Jadi Lebih Seru</h3>
            <p className="text-muted-foreground text-sm">
            Bikin target, pantau progress, lihat hasilnya. Nabung makin gampang dan kerasa nyata.
            </p>
          </Card>

          <Card
            className="bg-card p-6 hover:shadow-lg transition-all duration-300 animate-slide-up border-border"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Data Aman, Hidup Tenang</h3>
            <p className="text-muted-foreground text-sm">
            Privasi dijaga, data terenkripsi, auto-backup ke cloud. Jadi nggak usah was-was.
            </p>
          </Card>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Kata Mereka yang Udah Coba</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          DompetKu udah bantu ribuan orang nyatet duit lebih gampang dan rapi.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-card p-6 border-border">
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4" style={{ fill: "#FFD700", color: "#FFD700" }} />
              ))}
            </div>
            <p className="text-card-foreground mb-4">
              "DompetKu ngebantu banget buat ngatur gaji bulanan. Aplikasinya gampang dipakai, fiturnya jelas, export ke Excel juga praktis banget!"
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">AS</span>
              </div>
              <div>
                <p className="font-semibold text-card-foreground">Andi Setiawan</p>
                <p className="text-sm text-muted-foreground">Karyawan Swasta</p>
              </div>
            </div>
          </Card>

          <Card className="bg-card p-6 border-border">
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4" style={{ fill: "#FFD700", color: "#FFD700" }} />
              ))}
            </div>
            <p className="text-card-foreground mb-4">
              "Fitur catat hutang di DompetKu bikin aku bisa disiplin bayar cicilan. Alhamdulillah, semua lunas dalam 6 bulan 🙏"
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">SR</span>
              </div>
              <div>
                <p className="font-semibold text-card-foreground">Sari Rahayu</p>
                <p className="text-sm text-muted-foreground">Ibu Rumah Tangga</p>
              </div>
            </div>
          </Card>

          <Card className="bg-card p-6 border-border">
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4" style={{ fill: "#FFD700", color: "#FFD700" }} />
              ))}
            </div>
            <p className="text-card-foreground mb-4">
              "Sebagai freelancer yang punya banyak klien, DompetKu bener-bener nolong. Income tiap project bisa ketrek jelas, laporan bulanan juga detail banget!"
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">BP</span>
              </div>
              <div>
                <p className="font-semibold text-card-foreground">Budi Pratama</p>
                <p className="text-sm text-muted-foreground">Freelancer</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Atur Duit Tanpa Drama</h2>
          <p className="text-xl text-white/90 mb-8">
          DompetKu udah dipakai ribuan orang. Sekarang giliran kamu coba sendiri.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 transition-all duration-300 px-8 py-3"
            >
              Daftar Sekarang - Gratis!
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/favicon.ico" alt="DompetKu" className="w-8 h-8" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">DompetKu</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
              Catat pengeluaran, kelola hutang, sampai nabung jadi gampang bareng DompetKu.
              </p>
              <p className="text-sm text-muted-foreground">
                &copy; 2024 DompetKu. Dibuat dengan ❤️ supaya kamu lebih gampang atur duit.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground mb-4">Fitur</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Pencatat Transaksi</li>
                <li>Manajemen Hutang</li>
                <li>Rencana Tabungan</li>
                <li>Laporan Keuangan</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground mb-4">Bantuan</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Panduan Penggunaan</li>
                <li>FAQ</li>
                <li>Kontak Support</li>
                <li>Kebijakan Privasi</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
