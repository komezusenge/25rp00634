import { useEffect, useMemo, useState } from 'react'

const steps = [
  'Symptoms',
  'Patient Info',
  'Find Doctor',
  'Book Slot',
  'Review Details',
  'Confirm',
  'Arrival',
  'Live Wait',
  'Summary',
  'Follow-up',
]

const symptomOptions = [
  'Fever',
  'Cough',
  'Headache',
  'Stomach pain',
  'Fatigue',
  'Skin rash',
]

const doctorDirectory = [
  { id: 'd1', name: 'Dr. Aline Nkurunziza', speciality: 'General Medicine', eta: '15 min', confidence: 93 },
  { id: 'd2', name: 'Dr. Patrick Mugenzi', speciality: 'Pulmonology', eta: '22 min', confidence: 91 },
  { id: 'd3', name: 'Dr. Diane Mukamana', speciality: 'Gastroenterology', eta: '28 min', confidence: 88 },
  { id: 'd4', name: 'Dr. Joel Uwimana', speciality: 'Dermatology', eta: '35 min', confidence: 84 },
]

const clinicBranches = [
  { id: 'c1', name: 'Central Care Hub', area: 'Downtown', distance: '1.2 km' },
  { id: 'c2', name: 'Northside Clinic', area: 'Kimironko', distance: '2.7 km' },
  { id: 'c3', name: 'Riverside Health Point', area: 'Nyamirambo', distance: '4.1 km' },
]

const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'rw', label: 'Kinyarwanda' },
]

const translations = {
  en: {
    appTitle: 'Patient appointment guide',
    syncOnline: 'Online sync',
    syncOffline: 'Offline mode',
    appointmentsTitle: 'My appointments',
    pendingTitle: 'Pending appointment',
    viewAll: 'View all',
    close: 'Close',
    noPending: 'No pending appointments right now. Your next booking will appear here automatically.',
    qrHint: 'Scan this at reception for faster check-in.',
    reschedule: 'Reschedule +1 day',
    cancel: 'Cancel',
    cancelled: 'This appointment was cancelled.',
    delete: 'Delete permanently',
    back: 'Back',
    continue: 'Continue',
    completed: 'Completed',
    review: 'Review appointment',
    reviewSummary: 'Review all your details before confirming.',
    editDetails: 'Edit details',
    confirmBooking: 'Confirm booking',
  },
  fr: {
    appTitle: 'Guide de rendez-vous patient',
    syncOnline: 'Synchronisation en ligne',
    syncOffline: 'Mode hors ligne',
    appointmentsTitle: 'Mes rendez-vous',
    pendingTitle: 'Rendez-vous en attente',
    viewAll: 'Voir tout',
    close: 'Fermer',
    noPending: 'Aucun rendez-vous en attente pour le moment. Votre prochaine réservation apparaîtra ici automatiquement.',
    qrHint: 'Scannez ceci à la réception pour un enregistrement plus rapide.',
    reschedule: 'Reporter +1 jour',
    cancel: 'Annuler',
    cancelled: 'Ce rendez-vous a été annulé.',
    delete: 'Supprimer définitivement',
    back: 'Retour',
    continue: 'Continuer',
    completed: 'Terminé',
    review: 'Vérifier le rendez-vous',
    reviewSummary: 'Vérifiez tous les détails avant de confirmer.',
    editDetails: 'Modifier les détails',
    confirmBooking: 'Confirmer la réservation',
  },
  rw: {
    appTitle: 'Ubuyobozi bwo gusabira gahunda y’abarwayi',
    syncOnline: 'Guhuza biri gukora',
    syncOffline: 'Nta murongo',
    appointmentsTitle: 'Gahunda zanjye',
    pendingTitle: 'Gahunda itegereje',
    viewAll: 'Reba byose',
    close: 'Funga',
    noPending: 'Nta gahunda itegereje ubu. Iyindi uzasaba izagaragara hano mu buryo bwikora.',
    qrHint: 'Sikana aha ku iposita kugira ngo winjire vuba.',
    reschedule: 'Hindura +1 umunsi',
    cancel: 'Hagarika',
    cancelled: 'Iyi gahunda yahagaritswe.',
    delete: 'Siba burundu',
    back: 'Subira inyuma',
    continue: 'Komeza',
    completed: 'Byarangiye',    review: 'Reba gahunda',
    reviewSummary: 'Reba amakuru yose mbere yo kwemeza.',
    editDetails: 'Hindura amakuru',
    confirmBooking: 'Kwemeza kubika',  },
}

const defaultData = {
  symptoms: ['Fever'],
  duration: '1-2 days',
  severity: 2,
  fullName: '',
  email: '',
  location: '',
  doctorId: 'd1',
  date: '2026-05-01',
  time: '10:30',
  reminderSms: true,
  reminderApp: true,
  checkedIn: false,
  followupEnabled: true,
  medicationTime: '20:00',
}

const defaultAppointments = [
  {
    id: 'sample-1',
    patient: 'Aline Uwase',
    doctor: 'Dr. Aline Nkurunziza',
    date: '2026-05-01',
    time: '10:30',
    location: 'Central Care Hub',
    status: 'pending',
  },
]

function getSuggestedDoctors(symptoms) {
  const symptomSet = new Set(symptoms)

  const scoring = {
    d1: 75,
    d2: symptomSet.has('Cough') || symptomSet.has('Fever') ? 93 : 78,
    d3: symptomSet.has('Stomach pain') ? 96 : 74,
    d4: symptomSet.has('Skin rash') ? 95 : 70,
  }

  return [...doctorDirectory]
    .map((doctor) => ({ ...doctor, confidence: scoring[doctor.id] ?? doctor.confidence }))
    .sort((a, b) => b.confidence - a.confidence)
}

function Button({ children, variant = 'primary', disabled = false, onClick, type = 'button' }) {
  const styles = {
    primary:
      'bg-[var(--brand-600)] text-white shadow-[0_10px_24px_-12px_rgba(0,128,119,0.8)] hover:bg-[var(--brand-700)]',
    ghost: 'bg-transparent text-[var(--ink-700)] ring-1 ring-[var(--sand-400)] hover:bg-[var(--sand-100)]',
    soft: 'bg-[var(--mint-200)] text-[var(--ink-700)] hover:bg-[var(--mint-300)]',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`h-11 rounded-2xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]}`}
    >
      {children}
    </button>
  )
}

function Pill({ children, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
        active
          ? 'bg-[var(--brand-600)] text-white'
          : 'bg-white text-[var(--ink-600)] ring-1 ring-[var(--sand-300)] hover:bg-[var(--sand-100)]'
      }`}
    >
      {children}
    </button>
  )
}

function Card({ children, className = '' }) {
  return <section className={`rounded-3xl bg-white/90 p-4 shadow-soft ring-1 ring-[var(--sand-200)] ${className}`}>{children}</section>
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-2xl bg-[var(--sand-100)] px-3 py-2 text-sm">
      <span className="text-[var(--ink-700)]">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`h-7 w-12 rounded-full p-1 transition ${checked ? 'bg-[var(--brand-600)]' : 'bg-[var(--sand-400)]'}`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white transition ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </label>
  )
}

function QrStub() {
  return (
    <div className="grid grid-cols-5 gap-1 rounded-2xl bg-white p-3 ring-1 ring-[var(--sand-300)]">
      {Array.from({ length: 25 }).map((_, index) => {
        const filled = [0, 1, 4, 5, 6, 10, 12, 14, 15, 18, 20, 21, 22, 24].includes(index)
        return <span key={index} className={`h-3 rounded ${filled ? 'bg-[var(--ink-800)]' : 'bg-[var(--sand-200)]'}`} />
      })}
    </div>
  )
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString))
}

function App() {
  const [step, setStep] = useState(0)
  const [isOnline, setIsOnline] = useState(window.navigator.onLine)
  const [language, setLanguage] = useState(() => window.localStorage.getItem('careflow-language-v1') || 'en')
  const [locationStatus, setLocationStatus] = useState('idle')
  const [data, setData] = useState(() => {
    const saved = window.localStorage.getItem('careflow-draft-v1')
    return saved ? JSON.parse(saved) : defaultData
  })
  const [appointments, setAppointments] = useState(() => {
    const saved = window.localStorage.getItem('careflow-appointments-v1')
    return saved ? JSON.parse(saved) : defaultAppointments
  })
  const [queueNumber, setQueueNumber] = useState(14)
  const [showAppointments, setShowAppointments] = useState(false)

  const doctors = useMemo(() => getSuggestedDoctors(data.symptoms), [data.symptoms])
  const selectedDoctor = doctors.find((d) => d.id === data.doctorId) ?? doctors[0]
  const pendingAppointments = appointments.filter((item) => item.status === 'pending' || item.status === 'ready')
  const copy = translations[language] ?? translations.en

  useEffect(() => {
    const onOnline = () => setIsOnline(true)
    const onOffline = () => setIsOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('careflow-draft-v1', JSON.stringify(data))
  }, [data])

  useEffect(() => {
    window.localStorage.setItem('careflow-language-v1', language)
  }, [language])

  useEffect(() => {
    window.localStorage.setItem('careflow-appointments-v1', JSON.stringify(appointments))
  }, [appointments])

  const nearbyClinic = useMemo(() => {
    if (!data.location.trim()) {
      return clinicBranches[0]
    }

    const locationText = data.location.toLowerCase()
    if (locationText.includes('north') || locationText.includes('kimironko')) {
      return clinicBranches[1]
    }

    if (locationText.includes('river') || locationText.includes('nyamirambo')) {
      return clinicBranches[2]
    }

    return clinicBranches[0]
  }, [data.location])

  const detectLocation = () => {
    if (!window.navigator.geolocation) {
      setLocationStatus('unsupported')
      return
    }

    setLocationStatus('loading')
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const mappedLocation = `Near ${nearbyClinic.name} (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`
        setData((prev) => ({ ...prev, location: mappedLocation }))
        setLocationStatus('success')
      },
      () => {
        setLocationStatus('denied')
      },
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 60000 },
    )
  }

  useEffect(() => {
    if (step !== 6 || !data.checkedIn) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setQueueNumber((prev) => (prev > 2 ? prev - 1 : prev))
    }, isOnline ? 5000 : 9000)

    return () => window.clearInterval(timer)
  }, [step, data.checkedIn, isOnline])

  const canContinue = useMemo(() => {
    if (step === 0) return data.symptoms.length > 0
    if (step === 1)
      return Boolean(
        data.fullName.trim() &&
          data.email.trim() &&
          data.location.trim() &&
          data.email.includes('@'),
      )
    if (step === 2) return Boolean(data.doctorId)
    if (step === 3) return Boolean(data.date && data.time)
    if (step === 6) return data.checkedIn
    return true
  }, [step, data])

  const next = () => setStep((current) => Math.min(current + 1, steps.length - 1))
  const back = () => setStep((current) => Math.max(current - 1, 0))
  const finish = () => {
    const appointment = {
      id: `${data.email || 'patient'}-${data.date}-${data.time}`,
      patient: data.fullName || 'Patient',
      doctor: selectedDoctor?.name ?? 'Assigned doctor',
      date: data.date,
      time: data.time,
      location: nearbyClinic.name,
      status: data.checkedIn ? 'ready' : 'pending',
    }

    setAppointments((current) => {
      const filtered = current.filter((item) => item.id !== appointment.id)
      return [appointment, ...filtered]
    })

    setStep(0)
    setQueueNumber(14)
    setShowAppointments(true)
  }

  const cancelAppointment = (id) => {
    setAppointments((current) =>
      current.map((item) => (item.id === id ? { ...item, status: 'cancelled' } : item)),
    )
  }

  const deleteAppointment = (id) => {
    setAppointments((current) => current.filter((item) => item.id !== id))
  }

  const rescheduleAppointment = (id) => {
    setAppointments((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              date: new Date(new Date(item.date).getTime() + 24 * 60 * 60 * 1000)
                .toISOString()
                .slice(0, 10),
            }
          : item,
      ),
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--paper)] px-3 py-5 text-[var(--ink-700)]">
      <div className="ambient-glow" aria-hidden="true" />
      <div className="mx-auto w-full max-w-md rounded-[2rem] bg-gradient-to-b from-white/95 to-[var(--sand-100)] p-4 shadow-[0_24px_52px_-30px_rgba(29,56,66,0.55)] ring-1 ring-[var(--sand-300)]">
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-[0.85rem] uppercase tracking-[0.22em] text-[var(--ink-500)]">CareFlow Live</p>
            <h1 className="font-heading text-2xl text-[var(--ink-800)]">{copy.appTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            <label className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--ink-700)] ring-1 ring-[var(--sand-300)]">
              <span className="sr-only">Language</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="bg-transparent outline-none"
                aria-label="Language selector"
              >
                {languageOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isOnline ? 'bg-[var(--mint-200)] text-[var(--brand-700)]' : 'bg-[var(--sand-300)] text-[var(--ink-600)]'
              }`}
            >
              {isOnline ? copy.syncOnline : copy.syncOffline}
            </span>
          </div>
        </header>

        <Card className="mb-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-500)]">{copy.appointmentsTitle}</p>
              <h2 className="font-heading text-lg text-[var(--ink-800)]">{copy.pendingTitle}</h2>
            </div>
            <Button variant="soft" onClick={() => setShowAppointments(true)}>{copy.viewAll}</Button>
          </div>
          <div className="space-y-2">
            {pendingAppointments.slice(0, 1).map((appointment) => (
              <div key={appointment.id} className="rounded-2xl bg-[var(--sand-100)] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--ink-800)]">{appointment.patient}</p>
                    <p className="text-sm text-[var(--ink-600)]">{appointment.doctor}</p>
                    <p className="text-xs text-[var(--ink-500)]">
                      {formatDate(appointment.date)} • {appointment.time} • {appointment.location}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--mint-200)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-700)]">
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
            {pendingAppointments.length === 0 && (
              <div className="rounded-2xl bg-[var(--sand-100)] p-3 text-sm text-[var(--ink-600)]">
                {copy.noPending}
              </div>
            )}
          </div>
        </Card>

        {showAppointments && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-3 backdrop-blur-[2px]">
            <div className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-[2rem] bg-[var(--paper)] p-4 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.35)] ring-1 ring-[var(--sand-300)]">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-500)]">Appointments</p>
                  <h2 className="font-heading text-xl text-[var(--ink-800)]">Pending and upcoming</h2>
                </div>
                <Button variant="ghost" onClick={() => setShowAppointments(false)}>{copy.close}</Button>
              </div>

              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[var(--ink-800)]">{appointment.patient}</p>
                        <p className="text-sm text-[var(--ink-600)]">{appointment.doctor}</p>
                        <p className="text-xs text-[var(--ink-500)]">
                          {formatDate(appointment.date)} • {appointment.time}
                        </p>
                        <p className="text-xs text-[var(--ink-500)]">{appointment.location}</p>
                      </div>
                      <span className="rounded-full bg-[var(--mint-200)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-700)]">
                        {appointment.status}
                      </span>
                    </div>

                    {(appointment.status === 'pending' || appointment.status === 'ready') && (
                      <>
                        <QrStub />
                        <p className="mt-3 text-xs text-[var(--ink-500)]">
                          {copy.qrHint}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button variant="soft" onClick={() => rescheduleAppointment(appointment.id)}>{copy.reschedule}</Button>
                          <Button variant="ghost" onClick={() => cancelAppointment(appointment.id)}>{copy.cancel}</Button>
                        </div>
                      </>
                    )}

                    {appointment.status === 'cancelled' && (
                      <>
                        <div className="rounded-2xl bg-[var(--sand-100)] p-3 text-sm text-[var(--ink-600)]">
                          {copy.cancelled}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button variant="ghost" onClick={() => deleteAppointment(appointment.id)}>{copy.delete}</Button>
                        </div>
                      </>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        <Card className="mb-4">
          <div className="mb-3 flex items-center justify-between text-xs text-[var(--ink-500)]">
            <span>Step {step + 1} of {steps.length}</span>
            <span>{(copy.stepTitles && copy.stepTitles[step]) || steps[step]}</span>
          </div>
          <div className="grid grid-cols-8 gap-1.5">
            {steps.map((label, index) => (
              <div
                key={label}
                className={`h-1.5 rounded-full transition ${index <= step ? 'bg-[var(--brand-600)]' : 'bg-[var(--sand-300)]'}`}
              />
            ))}
          </div>
        </Card>

        <section key={step} className="screen-appear space-y-3" aria-live="polite">
          {step === 0 && (
            <Card>
              <h2 className="font-heading text-lg">1. {language === 'fr' ? 'Que ressentez-vous aujourd’hui ?' : language === 'rw' ? 'Uyu munsi wumva umeze ute?' : 'What are you feeling today?'}</h2>
              <p className="mb-3 text-sm text-[var(--ink-500)]">{language === 'fr' ? 'Sélectionnez les symptômes. Simplement, pour proposer le meilleur médecin.' : language === 'rw' ? 'Hitamo ibimenyetso. Byoroshye kugira ngo tuguhe umuganga ukwiye.' : 'Select symptoms. Keep it simple so we can suggest the best doctor.'}</p>
              <div className="mb-3 flex flex-wrap gap-2">
                {symptomOptions.map((symptom) => {
                  const selected = data.symptoms.includes(symptom)
                  return (
                    <Pill
                      key={symptom}
                      active={selected}
                      onClick={() => {
                        setData((prev) => ({
                          ...prev,
                          symptoms: selected
                            ? prev.symptoms.filter((item) => item !== symptom)
                            : [...prev.symptoms, symptom],
                        }))
                      }}
                    >
                      {symptom}
                    </Pill>
                  )
                })}
              </div>
              <label className="mb-2 block text-sm">
                <span className="mb-1 block text-[var(--ink-500)]">{language === 'fr' ? 'Depuis combien de temps ?' : language === 'rw' ? 'Bimaze igihe kingana iki?' : 'How long?'}</span>
                <select
                  value={data.duration}
                  onChange={(event) => setData((prev) => ({ ...prev, duration: event.target.value }))}
                  className="h-11 w-full rounded-2xl border border-[var(--sand-300)] bg-white px-3"
                >
                  <option>Today</option>
                  <option>1-2 days</option>
                  <option>3-4 days</option>
                  <option>More than 4 days</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-[var(--ink-500)]">{language === 'fr' ? 'Niveau d’inconfort' : language === 'rw' ? 'Urwego rw’ububabare' : 'Discomfort level'}</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={data.severity}
                  onChange={(event) => setData((prev) => ({ ...prev, severity: Number(event.target.value) }))}
                  className="w-full accent-[var(--brand-600)]"
                />
                <p className="text-xs text-[var(--ink-500)]">Level {data.severity} / 5</p>
              </label>
            </Card>
          )}

          {step === 1 && (
            <Card>
              <h2 className="font-heading text-lg">2. {language === 'fr' ? 'Informations patient' : language === 'rw' ? 'Amakuru y’umurwayi' : 'Patient information'}</h2>
              <p className="mb-3 text-sm text-[var(--ink-500)]">{language === 'fr' ? 'Nous collectons d’abord les informations de base pour simplifier la réservation.' : language === 'rw' ? 'Dutangirana n’amakuru y’ibanze kugira ngo gahunda ibe yoroshye kandi ifatika.' : 'We collect the basics first so the booking is personal and easier to manage later.'}</p>
              <div className="space-y-2">
                <label className="block text-sm">
                  <span className="mb-1 block text-[var(--ink-500)]">{language === 'fr' ? 'Nom complet' : language === 'rw' ? 'Amazina yose' : 'Full name'}</span>
                  <input
                    type="text"
                    value={data.fullName}
                    onChange={(event) => setData((prev) => ({ ...prev, fullName: event.target.value }))}
                    placeholder="e.g. Aline Uwase"
                    className="h-11 w-full rounded-2xl border border-[var(--sand-300)] bg-white px-3"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-[var(--ink-500)]">{language === 'fr' ? 'Adresse e-mail' : language === 'rw' ? 'Imeyili' : 'Email address'}</span>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(event) => setData((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="name@example.com"
                    className="h-11 w-full rounded-2xl border border-[var(--sand-300)] bg-white px-3"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-[var(--ink-500)]">{language === 'fr' ? 'Localisation' : language === 'rw' ? 'Aho uherereye' : 'Location'}</span>
                  <input
                    type="text"
                    value={data.location}
                    onChange={(event) => setData((prev) => ({ ...prev, location: event.target.value }))}
                    placeholder="City / area / hospital branch"
                    className="h-11 w-full rounded-2xl border border-[var(--sand-300)] bg-white px-3"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="soft" onClick={detectLocation}>{language === 'fr' ? 'Utiliser ma position' : language === 'rw' ? 'Koresha aho ndi' : 'Use my location'}</Button>
                  <span className="inline-flex items-center rounded-full bg-[var(--sand-100)] px-3 py-2 text-xs font-semibold text-[var(--ink-600)]">
                    {language === 'fr' ? 'À proximité' : language === 'rw' ? 'Hafi' : 'Nearby'}: {nearbyClinic.name}
                  </span>
                </div>
                <p className="text-xs text-[var(--ink-500)]">
                  {locationStatus === 'idle' && 'Location helps us suggest the closest branch automatically.'}
                  {locationStatus === 'loading' && 'Detecting your current location...'}
                  {locationStatus === 'success' && 'Location saved and matched to the nearest branch.'}
                  {locationStatus === 'denied' && 'Location access denied. You can type your area manually.'}
                  {locationStatus === 'unsupported' && 'This device does not support location detection.'}
                </p>
                <div className="rounded-2xl bg-[var(--mint-100)] p-3 text-sm">
                  <p className="font-semibold text-[var(--ink-800)]">{language === 'fr' ? 'Centre suggéré' : language === 'rw' ? 'Ishami risabwa' : 'Suggested branch'}</p>
                  <p className="text-[var(--ink-600)]">{nearbyClinic.name}</p>
                  <p className="text-[var(--ink-600)]">{nearbyClinic.area} • {nearbyClinic.distance} away</p>
                </div>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <h2 className="font-heading text-lg">3. {language === 'fr' ? 'Choix du médecin' : language === 'rw' ? 'Gushaka umuganga' : 'Doctor discovery'}</h2>
              <p className="mb-3 text-sm text-[var(--ink-500)]">
                {isOnline ? 'Live smart ranking based on your symptoms.' : 'Using saved doctor matches while offline.'}
              </p>
              <div className="space-y-2">
                {doctors.map((doctor) => {
                  const isSelected = data.doctorId === doctor.id
                  return (
                    <button
                      key={doctor.id}
                      type="button"
                      onClick={() => setData((prev) => ({ ...prev, doctorId: doctor.id }))}
                      className={`w-full rounded-2xl p-3 text-left transition ${
                        isSelected
                          ? 'bg-[var(--mint-200)] ring-2 ring-[var(--brand-500)]'
                          : 'bg-[var(--sand-100)] ring-1 ring-[var(--sand-300)]'
                      }`}
                    >
                      <p className="font-semibold text-[var(--ink-800)]">{doctor.name}</p>
                      <p className="text-xs text-[var(--ink-500)]">{doctor.speciality} • Next free: {doctor.eta}</p>
                      <p className="mt-1 text-xs font-semibold text-[var(--brand-700)]">Match score {doctor.confidence}%</p>
                    </button>
                  )
                })}
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <h2 className="font-heading text-lg">4. {language === 'fr' ? 'Réserver un rendez-vous' : language === 'rw' ? 'Bika gahunda' : 'Book appointment'}</h2>
              <p className="mb-3 text-sm text-[var(--ink-500)]">Pick a simple date and time. We auto-save your choices.</p>
              <div className="space-y-2">
                <label className="block text-sm">
                  <span className="mb-1 block text-[var(--ink-500)]">Date</span>
                  <input
                    type="date"
                    value={data.date}
                    onChange={(event) => setData((prev) => ({ ...prev, date: event.target.value }))}
                    className="h-11 w-full rounded-2xl border border-[var(--sand-300)] bg-white px-3"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-[var(--ink-500)]">Time</span>
                  <input
                    type="time"
                    value={data.time}
                    onChange={(event) => setData((prev) => ({ ...prev, time: event.target.value }))}
                    className="h-11 w-full rounded-2xl border border-[var(--sand-300)] bg-white px-3"
                  />
                </label>
              </div>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <h2 className="font-heading text-lg">5. {copy.review}</h2>
              <p className="mb-3 text-sm text-[var(--ink-500)]">{copy.reviewSummary}</p>
              <div className="space-y-2">
                <div className="rounded-2xl bg-[var(--mint-100)] p-3 text-sm">
                  <p className="font-semibold text-[var(--ink-800)] mb-2">Symptoms</p>
                  <p className="text-[var(--ink-600)]">{data.symptoms.join(', ')}</p>
                  <p className="text-xs text-[var(--ink-500)] mt-1">{data.duration} • Level {data.severity}/5</p>
                </div>
                <div className="rounded-2xl bg-[var(--sand-100)] p-3 text-sm">
                  <p className="font-semibold text-[var(--ink-800)] mb-2">Patient Information</p>
                  <p className="text-[var(--ink-600)]">{data.fullName}</p>
                  <p className="text-[var(--ink-600)]">{data.email}</p>
                  <p className="text-[var(--ink-600)]">{data.location}</p>
                </div>
                <div className="rounded-2xl bg-[var(--sand-100)] p-3 text-sm">
                  <p className="font-semibold text-[var(--ink-800)] mb-2">Doctor & Appointment</p>
                  <p className="text-[var(--ink-600)]">{selectedDoctor?.name}</p>
                  <p className="text-[var(--ink-600)]">{selectedDoctor?.speciality}</p>
                  <p className="text-[var(--ink-600)]">Match: {selectedDoctor?.confidence}%</p>
                  <p className="text-[var(--ink-600)] mt-1">{formatDate(data.date)} at {data.time}</p>
                  <p className="text-[var(--ink-600)]">{nearbyClinic.name}</p>
                </div>
              </div>
            </Card>
          )}

          {step === 5 && (
            <Card>
              <h2 className="font-heading text-lg">6. {language === 'fr' ? 'Confirmation et rappels' : language === 'rw' ? 'Kwemeza no kwibutsa' : 'Confirmation and reminders'}</h2>
              <div className="mb-3 rounded-2xl bg-[var(--mint-100)] p-3 text-sm">
                <p className="font-semibold text-[var(--ink-800)]">{data.fullName || 'Patient'} booked with {selectedDoctor?.name}</p>
                <p className="text-[var(--ink-600)]">{data.email}</p>
                <p className="text-[var(--ink-600)]">{data.location}</p>
                <p className="text-[var(--ink-600)]">{data.date} at {data.time}</p>
              </div>
              <div className="space-y-2">
                <Toggle label="SMS reminder" checked={data.reminderSms} onChange={(value) => setData((prev) => ({ ...prev, reminderSms: value }))} />
                <Toggle label="In-app reminder" checked={data.reminderApp} onChange={(value) => setData((prev) => ({ ...prev, reminderApp: value }))} />
              </div>
            </Card>
          )}

          {step === 6 && (
            <Card>
              <h2 className="font-heading text-lg">7. {language === 'fr' ? `Arrivée à l'hôpital et enregistrement` : language === 'rw' ? 'Kugera ku bitaro no kwiyandikisha' : 'Hospital arrival & check-in'}</h2>
              <p className="mb-3 text-sm text-[var(--ink-500)]">Tap one action only. Big target for quick use while stressed.</p>
              <button
                type="button"
                onClick={() => setData((prev) => ({ ...prev, checkedIn: !prev.checkedIn }))}
                className={`w-full rounded-2xl p-4 text-left transition ${
                  data.checkedIn ? 'bg-[var(--mint-200)] ring-2 ring-[var(--brand-500)]' : 'bg-[var(--sand-100)] ring-1 ring-[var(--sand-300)]'
                }`}
              >
                <p className="font-semibold text-[var(--ink-800)]">{data.checkedIn ? (language === 'fr' ? 'Enregistré avec succès' : language === 'rw' ? 'Kwinjira byagenze neza' : 'Checked in successfully') : (language === 'fr' ? 'Appuyez pour vous enregistrer' : language === 'rw' ? 'Kanda hano winjire' : 'Tap to check in now')}</p>
                <p className="text-xs text-[var(--ink-500)]">Desk B • QR fallback available if network is weak.</p>
              </button>
            </Card>
          )}

          {step === 7 && (
            <Card>
              <h2 className="font-heading text-lg">8. {language === 'fr' ? `File d'attente en direct` : language === 'rw' ? 'Gutegereza mu gihe nyacyo' : 'Live waiting experience'}</h2>
              <p className="mb-3 text-sm text-[var(--ink-500)]">Queue updates gently to reduce anxiety.</p>
              <div className="mb-3 rounded-3xl bg-[var(--ink-800)] p-4 text-[var(--sand-100)]">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--mint-300)]">Current queue</p>
                <p className="font-heading text-5xl">#{queueNumber}</p>
                <p className="text-sm">Estimated wait: {Math.max(5, queueNumber - 1)} minutes</p>
              </div>
              <div className="rounded-2xl bg-[var(--sand-100)] p-3 text-xs text-[var(--ink-600)]">
                {isOnline
                  ? 'Live mode active: numbers update every few seconds.'
                  : 'Offline mode: showing last synced queue, updates when network returns.'}
              </div>
            </Card>
          )}

          {step === 8 && (
            <Card>
              <h2 className="font-heading text-lg">9. {language === 'fr' ? 'Résumé après la visite' : language === 'rw' ? 'Incamake nyuma yo gusurwa' : 'Post-visit summary'}</h2>
              <p className="mb-3 text-sm text-[var(--ink-500)]">A clear recap before you go home.</p>
              <div className="space-y-2 text-sm">
                <div className="rounded-2xl bg-[var(--sand-100)] p-3">
                  <p className="font-semibold text-[var(--ink-800)]">Clinical note</p>
                  <p className="text-[var(--ink-600)]">Likely viral infection. Rest, hydration, and monitor fever for 48 hours.</p>
                </div>
                <div className="rounded-2xl bg-[var(--sand-100)] p-3">
                  <p className="font-semibold text-[var(--ink-800)]">Prescription</p>
                  <p className="text-[var(--ink-600)]">Paracetamol 500mg, one tablet every 8 hours after meals.</p>
                </div>
              </div>
            </Card>
          )}

          {step === 9 && (
            <Card>
              <h2 className="font-heading text-lg">10. {language === 'fr' ? 'Suivi et médicament' : language === 'rw' ? `Gukurikirana n'imiti` : 'Follow-up and medication'}</h2>
              <p className="mb-3 text-sm text-[var(--ink-500)]">{language === 'fr' ? 'Restez sur la bonne voie après votre retour à la maison.' : language === 'rw' ? 'Komeza kugenzura uko umeze umaze gusubira mu rugo.' : 'Stay on track after returning home.'}</p>
              <div className="space-y-2">
                <Toggle
                  label="Enable follow-up reminder"
                  checked={data.followupEnabled}
                  onChange={(value) => setData((prev) => ({ ...prev, followupEnabled: value }))}
                />
                <label className="block text-sm">
                  <span className="mb-1 block text-[var(--ink-500)]">Medication reminder time</span>
                  <input
                    type="time"
                    value={data.medicationTime}
                    onChange={(event) => setData((prev) => ({ ...prev, medicationTime: event.target.value }))}
                    className="h-11 w-full rounded-2xl border border-[var(--sand-300)] bg-white px-3"
                  />
                </label>
              </div>
              <div className="mt-3 rounded-2xl bg-[var(--mint-100)] p-3 text-sm text-[var(--ink-700)]">
                {language === 'fr' ? 'Le plan de récupération est enregistré localement. Il reste disponible même sans internet.' : language === 'rw' ? 'Gahunda yo gukira yabitswe ku gikoresho. Ikomeza kuboneka n’iyo nta murongo.' : 'Recovery plan saved locally. It remains available even without internet.'}
              </div>
            </Card>
          )}
        </section>

        <footer className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="ghost" onClick={back} disabled={step === 0}>
            {copy.back}
          </Button>
          <Button onClick={step === steps.length - 1 ? finish : next} disabled={!canContinue}>
            {step === steps.length - 1 ? copy.completed : copy.continue}
          </Button>
        </footer>
      </div>
    </main>
  )
}

export default App
