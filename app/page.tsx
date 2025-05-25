import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif', margin: '200px' }}>
      <h1 style={{ fontSize: '2.5em', marginBottom: '30px' }}>Tervetuloa Tietovisaan!</h1>
      <p style={{ fontSize: '1.2em', marginBottom: '40px' }}>
        Testaa tietosi ja pidä hauskaa!
      </p>
      <Link href="/quiz" legacyBehavior>
        <a style={{
          padding: '15px 30px',
          fontSize: '1.2em',
          cursor: 'pointer',
          backgroundColor: 'cornflowerblue',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          textDecoration: 'none'
        }}>
          Aloita Peli
        </a>
      </Link>
      {/* Linkki kirjautumiseen */}
    </div>
  );
}