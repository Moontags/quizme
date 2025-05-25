"use client"; 

import { useState, useEffect } from 'react';
import Link from 'next/link';


interface Question {
  id: number; 
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  categoryId: string;
}

interface Category {
  id: string; 
  name: string;
}

export default function QuizPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setError(null);
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error(`Kategorioiden haku epäonnistui: ${response.statusText}`);
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err: any) {
        setError(err.message || "Tuntematon virhe kategorioita haettaessa");
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);


  useEffect(() => {
    if (!selectedCategoryId) {
      setQuestions([]); 
      setQuizStarted(false);
      return;
    }

    const fetchQuestionsForCategory = async () => {
      try {
        setLoadingQuestions(true);
        setError(null);
        const response = await fetch(`/api/questions?categoryId=${selectedCategoryId}`);
        if (!response.ok) {
          throw new Error(`Kysymysten haku epäonnistui kategoriasta: ${response.statusText}`);
        }
        const data: Question[] = await response.json();
        if (data.length === 0) {
          setError(`Valitussa kategoriassa (${categories.find(c => c.id === selectedCategoryId)?.name || selectedCategoryId}) ei ole kysymyksiä.`);
          setQuestions([]);
          setQuizStarted(false);
        } else {
          setQuestions(data);
          setQuizStarted(true); 
        }
      } catch (err: any) {
        setError(err.message || "Tuntematon virhe kysymyksiä haettaessa");
        console.error(err);
        setQuestions([]);
        setQuizStarted(false);
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestionsForCategory();
  }, [selectedCategoryId, categories]); 


  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
   
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setScore(0);
    setQuizStarted(false); 
    setQuizFinished(false);
    setError(null); 
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (quizFinished) return; 
    setSelectedAnswerIndex(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswerIndex === null || questions.length === 0) return;

    if (selectedAnswerIndex === questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(prevScore => prevScore + 1);
    }

    setSelectedAnswerIndex(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setSelectedCategoryId(null); 
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setScore(0);
    setQuizStarted(false);
    setQuizFinished(false);
    setError(null);
    setLoadingCategories(false); 
    setLoadingQuestions(false);
  };

  // ---------- RENDERING ----------

  if (loadingCategories) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>Ladataan kategorioita...</p>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif', color: 'red' }}>
        <h2>Virhe!</h2>
        <p>{error}</p>
        <button
          onClick={restartQuiz}
          style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
        >
          Yritä uudelleen (valitse kategoria)
        </button>
        <div style={{ marginTop: '20px' }}>
          <Link href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>
            Palaa etusivulle
          </Link>
        </div>
      </div>
    );
  }


  if (!quizStarted || !selectedCategoryId) {
    return (
      <div style={{
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: 'auto', 
        textAlign: 'center',
      
        marginTop: '50px' 
      }}>
        <h1 style={{
         
          fontSize: '2.2em', 
         
          marginBottom: '30px',
          marginTop: '20px' 
        }}>
          Valitse Kategoria
        </h1>
        {categories.length === 0 && !loadingCategories && <p>Kategorioita ei löytynyt.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              style={{
                padding: '12px',
                fontSize: '1.1em', 
                cursor: 'pointer',
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
        {loadingQuestions && selectedCategoryId && <p style={{ marginTop: '20px' }}>Ladataan kysymyksiä...</p>}
        <div style={{ marginTop: '40px' }}> 
          <Link href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>
            Palaa etusivulle
          </Link>
        </div>
      </div>
    );
  }


   if (quizFinished) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', 
        minHeight: 'calc(100vh - 100px)', 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box' 
      }}>
        <div style={{ 
          textAlign: 'center',
          padding: '30px 40px', 
          borderRadius: '12px', 
          boxShadow: '0 2px 1px rgba(0, 0, 0, 0.1)', 
          maxWidth: '550px', 
          width: '100%' 
        }}>
          <h1 style={{
            fontSize: '2.8em', 
            color: '#0056b3', 
            marginBottom: '25px',
            fontWeight: 'bold'
          }}>
            Quiz Päättyi! 🎉 
          </h1>
          <p style={{
            fontSize: '1.4em', 
            margin: '25px 0',
            color: '#333'
          }}>
            Hienoa työtä! Sait <strong style={{ color: '#28a745', fontSize: '1.1em' }}>{score} / {questions.length}</strong> oikein
            <br />
            kategoriassa "{categories.find(c => c.id === selectedCategoryId)?.name}".
          </p>
          <button
            onClick={restartQuiz} 
            style={{
              padding: '12px 25px',
              fontSize: '1.1em',
              fontWeight: 'bold',
              cursor: 'pointer',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
              transition: 'transform 0.1s ease, background-color 0.2s ease', 
              margin: '15px 0' 
            }}
          
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Pelaa uudestaan
          </button>
          <div style={{ marginTop: '30px' }}>
            <Link href="/" style={{ color: '#007bff', textDecoration: 'underline', fontSize: '1em' }}>
              Palaa etusivulle
            </Link>
          </div>
        </div>
      </div>
    );
  }


  if (questions.length === 0 || !quizStarted) {
   
    if(loadingQuestions) return <p style={{ textAlign: 'center', marginTop: '20px' }}>Ladataan kysymyksiä...</p>;
    return (
        <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <p>Kysymyksiä ei löytynyt valitulle kategorialle tai niitä ladataan vielä.</p>
            <button onClick={restartQuiz} style={{ marginTop: '10px', padding: '8px 15px' }}>Valitse toinen kategoria</button>
        </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
 
  if (!currentQuestion) {
    return <p style={{textAlign: 'center', marginTop: '20px'}}>Virhe: Nykyistä kysymystä ei voitu ladata. Yritä valita kategoria uudelleen.</p>;
  }

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: 'auto', 
      marginTop: '50px' 
    }}>
      <h1 style={{
        textAlign: 'center',
       
        fontSize: '2em', 
        
        marginTop: '0px', 
        marginBottom: '20px' 
      }}>
        Kategoria: {categories.find(c => c.id === selectedCategoryId)?.name || 'Kysymyspeli'}
      </h1>
      <div style={{ border: '1px solid #eee', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2em', margin: 0 }}>
            Kysymys {currentQuestionIndex + 1}/{questions.length}
            </h2>
            <p style={{ margin: 0, fontWeight: 'bold' }}>Pisteet: {score}</p>
        </div>
        <p style={{ fontSize: '1.1em', marginBottom: '20px', minHeight: '40px' }}>{currentQuestion.questionText}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              style={{
                padding: '12px', textAlign: 'left', cursor: 'pointer', border: '1px solid #ccc',
                borderRadius: '5px', backgroundColor: selectedAnswerIndex === index ? '#d0eaaa' : 'white', fontSize: '1em',
              }}
            >
              {index + 1}. {option} 
            </button>
          ))}
        </div>
        <button
          onClick={handleNextQuestion}
          disabled={selectedAnswerIndex === null}
          style={{
            display: 'block', width: '100%', padding: '12px', fontSize: '1em',
            cursor: selectedAnswerIndex === null ? 'not-allowed' : 'pointer',
            backgroundColor: selectedAnswerIndex === null ? '#228a22' : '#228a22',
            color: 'white', border: 'none', borderRadius: '5px', marginTop: '25px',
            opacity: selectedAnswerIndex === null ? 0.6 : 1,
          }}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Näytä tulokset' : 'Seuraava kysymys'}
        </button>
      </div>
       <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button
            onClick={restartQuiz}
            style={{ padding: '8px 15px', cursor: 'pointer', marginRight: '10px' }}
          >
            Vaihda kategoriaa
          </button>
          <Link href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>
            Palaa etusivulle
          </Link>
        </div>
    </div>
  );
}