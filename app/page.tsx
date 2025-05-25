import Link from 'next/link';

export default function HomePage() {
  return (
      <div style={{
      maxWidth: '700px',
      margin: '0 auto',
      padding: '40px 20px',
      paddingTop: '15vh',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '80vh'
    }}>
      <h1 style={{ fontSize: '2.5em', marginBottom: '30px', color: '#333' }}>
        Tervetuloa Tietovisaan!
      </h1>
      <p style={{ fontSize: '1.2em', marginBottom: '40px', color: '#555' }}>
        Testaa tietosi ja pidä hauskaa!
      </p>
      <Link href="/quiz" legacyBehavior>
        <a style={{
          display: 'inline-block',
          padding: '15px 30px',
          fontSize: '1.2em',
          cursor: 'pointer',
          backgroundColor: 'cornflowerblue',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          transition: 'transform 0.1s ease',
        }}>
          Aloita Peli
        </a>
      </Link>
      {/* Linkki kirjautumiseen */}
    </div>
  );
}