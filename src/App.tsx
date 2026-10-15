import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Home } from './pages/Home'
import { Quiz } from './pages/Quiz'
import { Results } from './pages/Results'
import { StyleGuide } from './pages/StyleGuide'
import type { QuizAnswers } from './types'

type Screen = 'home' | 'quiz' | 'results' | 'styleguide'

/** Atalho de conferência: `/#guia` abre o guia de estilo, sem tirá-lo do fluxo normal. */
function initialScreen(): Screen {
  return window.location.hash === '#guia' ? 'styleguide' : 'home'
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(initialScreen)
  const [answers, setAnswers] = useState<QuizAnswers | null>(null)
  const reduceMotion = useReducedMotion()

  const screenTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: reduceMotion ? 0 : 0.2 },
  }

  return (
    <AnimatePresence mode="wait">
      {screen === 'home' && (
        <motion.div key="home" {...screenTransition}>
          <Home onStart={() => setScreen('quiz')} />
        </motion.div>
      )}

      {screen === 'quiz' && (
        <motion.div key="quiz" {...screenTransition}>
          <Quiz
            onBack={() => setScreen('home')}
            onFinish={(quizAnswers) => {
              setAnswers(quizAnswers)
              setScreen('results')
            }}
          />
        </motion.div>
      )}

      {screen === 'results' && answers && (
        <motion.div key="results" {...screenTransition}>
          <Results
            answers={answers}
            onRestart={() => {
              setAnswers(null)
              setScreen('home')
            }}
          />
        </motion.div>
      )}

      {screen === 'styleguide' && (
        <motion.div key="styleguide" {...screenTransition}>
          <StyleGuide />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
