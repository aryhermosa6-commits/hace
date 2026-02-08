import Head from 'next/head';
import HeaderNav from '../components/HeaderNav';

// Static measurement and print care guide. In a real application these could
// be editable via admin panel or fetched from CMS, but for now they are
// hardcoded to provide quick reference for customers. The guides are
// responsive and optimized for both mobile and desktop.
export default function GuidePage({ __ctx }) {
  const ctx = __ctx || {};
  const s = ctx.data?.settings || {};
  return (
    <>
      <Head>
        <title>{s.brand || 'Ponorogo Hardcore'} — Guide</title>
        <meta name="description" content="Size measurement and print care guide for Ponorogo Hardcore apparel." />
      </Head>
      <HeaderNav ctx={ctx} />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <h1 className="h1 kinetic">Measurement & Care Guide</h1>
        <p className="p" style={{ marginBottom: 20 }}>
          Sebelum pesan, pastikan ukuran dan perawatan sablon sesuai. Berikut panduan ukur tubuh dan
          cara merawat print agar awet.
        </p>

        <section style={{ marginBottom: 40 }}>
          <h2 className="h2 kinetic">Cara Mengukur Tubuh</h2>
          <p className="small">
            Gunakan pita ukur dan berdiri tegak. Mintalah bantuan teman bila perlu. Catat ukuran dalam
            sentimeter.
          </p>
          <ul className="small" style={{ listStyle: 'circle', paddingLeft: 20, lineHeight: 1.6 }}>
            <li><strong>Dada:</strong> Ukur keliling dada pada bagian terlebar.</li>
            <li><strong>Panjang badan:</strong> Ukur dari pundak (bahu) hingga pinggang.</li>
            <li><strong>Panjang lengan:</strong> Ukur dari bahu hingga pergelangan tangan.</li>
            <li><strong>Panjang kaos:</strong> Bandingkan dengan kaos favoritmu dari kerah hingga bawah.</li>
          </ul>
          <p className="small" style={{ marginTop: 12 }}>
            Cocokkan ukuran tersebut dengan chart pada halaman produk untuk menemukan size yang pas.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 className="h2 kinetic">Perawatan Sablon & Kain</h2>
          <p className="small">
            Agar sablon tetap tajam dan kain awet, ikuti instruksi berikut:
          </p>
          <ul className="small" style={{ listStyle: 'circle', paddingLeft: 20, lineHeight: 1.6 }}>
            <li>Cuci dengan tangan atau mesin mode lembut, air dingin atau hangat (&lt;30°C).</li>
            <li>Jangan gunakan pemutih atau deterjen keras yang bisa merusak serat dan sablon.</li>
            <li>Balik kaos sebelum dicuci dan disetrika untuk melindungi sablon.</li>
            <li>Setrika suhu sedang dari sisi dalam; hindari kontak langsung setrika dengan sablon.</li>
            <li>Jemur di tempat teduh agar warna tidak cepat pudar.</li>
          </ul>
          <p className="small" style={{ marginTop: 12 }}>
            Perawatan yang tepat akan menjaga kualitas apparel hardcore favoritmu lebih lama.
          </p>
        </section>

        <section>
          <h2 className="h2 kinetic">FAQs Tambahan</h2>
          <p className="small">
            Bila masih ragu dengan ukuran atau cara perawatan, silakan hubungi kami lewat WA atau IG.
          </p>
        </section>
      </div>
    </>
  );
}