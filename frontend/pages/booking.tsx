import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import CookieBanner from '../components/CookieBanner';

export default function Booking() {
    const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedDuration, setSelectedDuration] = useState(0.5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [bookings, setBookings] = useState<{ [key: string]: number }>({});

    // Customer details
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [street, setStreet] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [dropboxLinks, setDropboxLinks] = useState<string[]>([]);
    const [isUploadingToDropbox, setIsUploadingToDropbox] = useState(false);

    // Load bookings from localStorage and initialize currentMonth
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedBookings = localStorage.getItem('bookings');
            if (savedBookings) {
                setBookings(JSON.parse(savedBookings));
            }
            // Initialize currentMonth on client side
            setCurrentMonth(new Date());
        }
    }, []);

    // EmailJS initialization
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const checkEmailJS = () => {
                if ((window as any).emailjs) {
                    console.log("EmailJS betöltődött, inicializálás...");
                    (window as any).emailjs.init("_UgC1pw0jHHqLl6sG");
                    console.log("EmailJS inicializálva");
                } else {
                    console.log("EmailJS még nem töltődött be, újrapróbálás...");
                    setTimeout(checkEmailJS, 1000);
                }
            };
            checkEmailJS();
        }
    }, []);

    const monthNames = [
        'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
        'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'
    ];

    // Calendar generation
    const generateCalendar = () => {
        if (!currentMonth) return [];

        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const calendar = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Generate 42 days (6 weeks)
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            const dateStr = currentDate.getFullYear() + '-' +
                String(currentDate.getMonth() + 1).padStart(2, '0') + '-' +
                String(currentDate.getDate()).padStart(2, '0');

            const isCurrentMonth = currentDate.getMonth() === month;
            const isToday = dateStr === (today.getFullYear() + '-' +
                String(today.getMonth() + 1).padStart(2, '0') + '-' +
                String(today.getDate()).padStart(2, '0'));
            const isPast = currentDate < today;

            calendar.push({
                date: dateStr,
                day: currentDate.getDate(),
                isCurrentMonth,
                isToday,
                isPast
            });
        }

        return calendar;
    };

    // Time slots generation (30-minute intervals)
    const generateTimeSlots = (date: string) => {
        const slots = [];
        const startHour = 9;
        const endHour = 20;

        for (let hour = startHour; hour < endHour; hour++) {
            // 00 minutes
            const time00 = `${hour.toString().padStart(2, '0')}:00`;
            const slotDateTime00 = new Date(`${date}T${time00}:00`);
            const now = new Date();
            const bookingKey00 = `${date}_${time00}`;
            const bookingCount00 = bookings[bookingKey00] || 0;
            const available00 = slotDateTime00 > now && bookingCount00 === 0;

            slots.push({
                time: time00,
                available: available00,
                bookingCount: bookingCount00,
                isBooked: bookingCount00 > 0
            });

            // 30 minutes
            const time30 = `${hour.toString().padStart(2, '0')}:30`;
            const slotDateTime30 = new Date(`${date}T${time30}:00`);
            const bookingKey30 = `${date}_${time30}`;
            const bookingCount30 = bookings[bookingKey30] || 0;
            const available30 = slotDateTime30 > now && bookingCount30 === 0;

            slots.push({
                time: time30,
                available: available30,
                bookingCount: bookingCount30,
                isBooked: bookingCount30 > 0
            });
        }

        return slots;
    };

    // Event handlers
    const handleDateClick = (date: string) => {
        const clickedDate = new Date(date + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (clickedDate >= today) {
            setSelectedDate(date);
            setSelectedTimes([]);
            setSelectedDuration(0.5);
            setCustomerName('');
            setCustomerEmail('');
            setPostalCode('');
            setStreet('');
            setHouseNumber('');
            setUploadedFiles([]);
            setAcceptedTerms(false);
        }
    };

    const handleTimeClick = (time: string) => {
        // Ellenőrizzük, hogy az időpont lefoglalt-e
        const bookingKey = `${selectedDate}_${time}`;
        const isBooked = bookings[bookingKey] > 0;

        if (isBooked) {
            return; // Ne engedjük a lefoglalt időpontok kiválasztását
        }

        setSelectedTimes(prev => {
            if (prev.includes(time)) {
                return prev.filter(t => t !== time);
            } else {
                return [...prev, time];
            }
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setUploadedFiles(prev => [...prev, ...files]);
    };

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
        setDropboxLinks(prev => prev.filter((_, i) => i !== index));
    };

    // Dropbox integráció
    const uploadToDropbox = async (file: File): Promise<string> => {
        // Ez egy egyszerűsített Dropbox integráció
        // Valós implementációban Dropbox API-t kellene használni
        return new Promise((resolve) => {
            setTimeout(() => {
                // Generálunk egy mock Dropbox linket
                const mockLink = `https://www.dropbox.com/s/${Math.random().toString(36).substring(2, 15)}/${file.name}?dl=1`;
                resolve(mockLink);
            }, 1000);
        });
    };

    const uploadAllToDropbox = async () => {
        if (uploadedFiles.length === 0) return;

        setIsUploadingToDropbox(true);
        const links: string[] = [];

        for (const file of uploadedFiles) {
            try {
                const link = await uploadToDropbox(file);
                links.push(link);
            } catch (error) {
                console.error('Dropbox upload hiba:', error);
            }
        }

        setDropboxLinks(links);
        setIsUploadingToDropbox(false);
    };

    const downloadFile = (file: File) => {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Apple Calendar (iPhone Calendar) integráció
    const generateICSFile = (eventTitle: string, eventDateTime: Date, endDateTime: Date, eventDescription: string) => {
        const formatICSDate = (date: Date) => {
            return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        };

        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Mihaszna Matek//Booking System//HU
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}@mihaszna-matek.hu
DTSTART:${formatICSDate(eventDateTime)}
DTEND:${formatICSDate(endDateTime)}
SUMMARY:${eventTitle}
DESCRIPTION:${eventDescription.replace(/\n/g, '\\n')}
LOCATION:Online Teams vagy Fóton
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT15M
DESCRIPTION:Matekóra emlékeztető
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

        return icsContent;
    };

    const addToAppleCalendar = (eventTitle: string, eventDateTime: Date, endDateTime: Date, eventDescription: string) => {
        const icsContent = generateICSFile(eventTitle, eventDateTime, endDateTime, eventDescription);
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'matekora.ics';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        setUploadedFiles(prev => [...prev, ...files]);
    };

    const nextMonth = () => {
        if (currentMonth) {
            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
        }
    };

    const prevMonth = () => {
        if (currentMonth) {
            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
        }
    };

    const goToToday = () => {
        setCurrentMonth(new Date());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate || selectedTimes.length === 0 || !selectedSubject || !customerName || !customerEmail || !postalCode || !street || !houseNumber || !acceptedTerms) {
            setSubmitMessage('Kérjük, válasszon ki legalább egy időpontot és töltse ki az összes kötelező mezőt! (A fájl feltöltés opcionális)');
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            // File Base64 encoding (only for small files)
            let fileData: string[] = [];
            if (uploadedFiles.length > 0) {
                const maxFileSize = 500 * 1024; // 500KB limit
                const smallFiles = uploadedFiles.filter(file => file.size <= maxFileSize);

                if (smallFiles.length > 0) {
                    const filePromises = smallFiles.map(file => {
                        return new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                                const base64 = reader.result as string;
                                resolve(`${file.name} (${(file.size / 1024).toFixed(1)} KB): ${base64.split(',')[1]}`);
                            };
                            reader.readAsDataURL(file);
                        });
                    });
                    fileData = await Promise.all(filePromises);
                }
            }

            // EmailJS booking request
            if (typeof window !== 'undefined' && (window as any).emailjs) {
                const totalPrice = selectedTimes.length * 5500;
                const timeSlotsText = selectedTimes.map(time => {
                    const bookingKey = `${selectedDate}_${time}`;
                    const currentBookings = bookings[bookingKey] || 0;
                    const newBookingCount = currentBookings + 1;
                    return `${time} (${newBookingCount}. foglalás)`;
                }).join(', ');

                const emailParams = {
                    to_email: 'mihaszna.math@gmail.com',
                    user_name: customerName,
                    user_email: customerEmail,
                    message: `
Új időpontfoglalási kérés érkezett!

📅 Dátum: ${new Date(selectedDate).toLocaleDateString('hu-HU')}
⏰ Időpontok: ${timeSlotsText}
💰 Összes ár: ${totalPrice} Ft
📚 Tantárgy: ${selectedSubject}

👤 Foglaló adatok:
   📝 Név: ${customerName}
   📧 Email: ${customerEmail}
   🏠 Lakcím: ${postalCode} ${street} ${houseNumber}
   📎 Feltöltött fájlok: ${uploadedFiles.map(f => f.name).join(', ')}

Kérjük, jelezze vissza a foglaló felé a foglalás elfogadását vagy elutasítását!
                    `.trim(),
                    reply_to: customerEmail
                };

                let emailSent = false;
                try {
                    await (window as any).emailjs.send(
                        'service_fnoxi68',
                        'template_rt2i7ou',
                        emailParams
                    );
                    emailSent = true;
                } catch (emailError) {
                    console.error('EmailJS hiba:', emailError);
                    emailSent = false;
                }

                setSubmitMessage(`Sikeres időpontfoglalás! Hamarosan felvesszük Önnel a kapcsolatot.${uploadedFiles.length > 0 ? ` (${uploadedFiles.length} fájl elküldve)` : ''} ${emailSent ? 'Email elküldve: mihaszna.math@gmail.com' : 'Email küldés sikertelen, de a foglalás mentve'}`);

                // Save bookings to localStorage
                const newBookings = { ...bookings };
                selectedTimes.forEach(time => {
                    const bookingKey = `${selectedDate}_${time}`;
                    newBookings[bookingKey] = (newBookings[bookingKey] || 0) + 1;
                });
                setBookings(newBookings);
                localStorage.setItem('bookings', JSON.stringify(newBookings));
            } else {
                // Egyszerű foglalás mentése
                const totalPrice = selectedTimes.length * 5500;

                setSubmitMessage(`Sikeres időpontfoglalás! Hamarosan felvesszük Önnel a kapcsolatot.${uploadedFiles.length > 0 ? ` (${uploadedFiles.length} fájl elküldve)` : ''}`);

                // Save bookings to localStorage
                const newBookings = { ...bookings };
                selectedTimes.forEach(time => {
                    const bookingKey = `${selectedDate}_${time}`;
                    newBookings[bookingKey] = (newBookings[bookingKey] || 0) + 1;
                });
                setBookings(newBookings);
                localStorage.setItem('bookings', JSON.stringify(newBookings));
            }

            setSelectedDate('');
            setSelectedTimes([]);
            setSelectedSubject('');
            setSelectedDuration(0.5);
            setCustomerName('');
            setCustomerEmail('');
            setPostalCode('');
            setStreet('');
            setHouseNumber('');
            setUploadedFiles([]);
            setAcceptedTerms(false);
        } catch (error) {
            console.error('Foglalási hiba:', error);
            setSubmitMessage('Hiba történt a foglalás során. Kérjük, próbáld újra.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Head>
                <title>Időpontfoglalás - Mihaszna Matek</title>
                <meta name="description" content="Foglalj időpontot matekórára Mihaszna Matekkal" />
                <Script
                    src="https://cdn.emailjs.com/sdk/2.3.2/email.min.js"
                    strategy="beforeInteractive"
                />
            </Head>

            <div className="booking-page">
                {/* NAVBAR */}
                <nav>
                    <div className="logo">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 200 200"
                            width="48"
                            height="48"
                        >
                            <defs>
                                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#39FF14" />
                                    <stop offset="100%" stopColor="#FF49DB" />
                                </linearGradient>
                                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            <text
                                x="40%"
                                y="60%"
                                textAnchor="middle"
                                fontFamily="Montserrat, sans-serif"
                                fontWeight="700"
                                fontSize="100"
                                fill="url(#grad)"
                                filter="url(#glow)"
                            >
                                ∑
                            </text>
                            <text
                                x="60%"
                                y="60%"
                                textAnchor="middle"
                                fontFamily="Montserrat, sans-serif"
                                fontWeight="700"
                                fontSize="100"
                                fill="url(#grad)"
                                filter="url(#glow)"
                            >
                                ∫
                            </text>
                        </svg>
                    </div>
                    <ul className="nav-links">
                        <li>
                            <Link href="/#about">Rólam</Link>
                        </li>
                        <li>
                            <Link href="/#courses">Kiket vállalok?</Link>
                        </li>
                        <li>
                            <Link href="/#testimonials">Vélemények</Link>
                        </li>
                        <li>
                            <span className="booking-link active">📅 Időpontfoglalás</span>
                        </li>
                        <li>
                            <Link href="/#contact">Kapcsolat</Link>
                        </li>
                        <li>
                            <Link href="/#auth">Bejelentkezés</Link>
                        </li>
                    </ul>
                    <button className="nav-toggle" aria-label="Menü megnyitása">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </nav>

                {/* CALENDAR SECTION */}
                <section className="calendar-section">
                    <div className="section-content">
                        <div className="calendar-container">
                            {/* Calendar Header */}
                            <div className="calendar-header">
                                <div className="calendar-nav">
                                    <button onClick={prevMonth} className="nav-btn">‹</button>
                                    <h3>{currentMonth ? `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}` : 'Betöltés...'}</h3>
                                    <button onClick={nextMonth} className="nav-btn">›</button>
                                </div>
                                <button onClick={goToToday} className="today-btn">Ma</button>
                            </div>

                            {/* Calendar Grid */}
                            {!currentMonth ? (
                                <div className="calendar-loading">
                                    <div className="loading-spinner">Betöltés...</div>
                                </div>
                            ) : (
                                <>
                                    {/* Weekday Headers */}
                                    <div className="calendar-weekdays">
                                        <div className="weekday">Vas</div>
                                        <div className="weekday">Hét</div>
                                        <div className="weekday">Kedd</div>
                                        <div className="weekday">Szer</div>
                                        <div className="weekday">Csüt</div>
                                        <div className="weekday">Pént</div>
                                        <div className="weekday">Szom</div>
                                    </div>

                                    {/* Calendar Days */}
                                    <div className="calendar-days">
                                        {generateCalendar().map((day, index) => (
                                            <div
                                                key={index}
                                                className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''} ${day.isPast ? 'past' : 'clickable'} ${selectedDate === day.date ? 'selected' : ''}`}
                                                onClick={() => !day.isPast && handleDateClick(day.date)}
                                            >
                                                <span className="day-number">{day.day}</span>
                                                {day.isToday && <div className="today-indicator"></div>}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Time Slots */}
                        {selectedDate && (
                            <div className="time-slots-container">
                                <div className="selected-date-info">
                                    <h3>Választott dátum: {new Date(selectedDate).toLocaleDateString('hu-HU')}</h3>
                                </div>

                                <div className="time-slots">
                                    <h4>Rendelkezésre álló időpontok:</h4>
                                    <div className="slots-grid">
                                        {generateTimeSlots(selectedDate).map((slot, index) => (
                                            <button
                                                key={index}
                                                className={`time-slot ${slot.available ? 'available' :
                                                    slot.bookingCount > 0 ? 'booked' : 'unavailable'
                                                    } ${selectedTimes.includes(slot.time) ? 'selected' : ''}`}
                                                onClick={() => slot.available && handleTimeClick(slot.time)}
                                                disabled={!slot.available}
                                            >
                                                <div className="time-text">{slot.time}</div>
                                                {slot.bookingCount > 0 && (
                                                    <div className="booking-count">
                                                        {slot.bookingCount} foglalás
                                                    </div>
                                                )}
                                                {selectedTimes.includes(slot.time) && (
                                                    <div className="selected-indicator">✓</div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Booking Form and Info Panel Side by Side */}
                        {selectedDate && (
                            <div className="booking-section">
                                <div className="booking-form-container">
                                    <h3>Foglalási adatok</h3>
                                    <form onSubmit={handleSubmit} className="booking-form">
                                        <div className="form-group">
                                            <label htmlFor="customerName">📝 Név (kötelező):</label>
                                            <input
                                                type="text"
                                                id="customerName"
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                placeholder="Adja meg a teljes nevét"
                                                required
                                                style={{
                                                    background: 'white',
                                                    color: 'black',
                                                    fontWeight: '600',
                                                    border: '2px solid #39ff14'
                                                }}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="customerEmail">📧 E-mail cím (kötelező):</label>
                                            <input
                                                type="email"
                                                id="customerEmail"
                                                value={customerEmail}
                                                onChange={(e) => setCustomerEmail(e.target.value)}
                                                placeholder="pelda@email.com"
                                                required
                                                style={{
                                                    background: 'white',
                                                    color: 'black',
                                                    fontWeight: '600',
                                                    border: '2px solid #39ff14'
                                                }}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="postalCode">📮 Irányítószám (kötelező):</label>
                                            <input
                                                type="text"
                                                id="postalCode"
                                                value={postalCode}
                                                onChange={(e) => setPostalCode(e.target.value)}
                                                placeholder="1234"
                                                required
                                                style={{
                                                    background: 'white',
                                                    color: 'black',
                                                    fontWeight: '600',
                                                    border: '2px solid #39ff14'
                                                }}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="street">🏠 Utca (kötelező):</label>
                                            <input
                                                type="text"
                                                id="street"
                                                value={street}
                                                onChange={(e) => setStreet(e.target.value)}
                                                placeholder="Példa: Kossuth Lajos utca"
                                                required
                                                style={{
                                                    background: 'white',
                                                    color: 'black',
                                                    fontWeight: '600',
                                                    border: '2px solid #39ff14'
                                                }}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="houseNumber">🏢 Házszám (kötelező):</label>
                                            <input
                                                type="text"
                                                id="houseNumber"
                                                value={houseNumber}
                                                onChange={(e) => setHouseNumber(e.target.value)}
                                                placeholder="123"
                                                required
                                                style={{
                                                    background: 'white',
                                                    color: 'black',
                                                    fontWeight: '600',
                                                    border: '2px solid #39ff14'
                                                }}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="subject">📚 Témakör (kötelező):</label>
                                            <input
                                                type="text"
                                                id="subject"
                                                value={selectedSubject}
                                                onChange={(e) => setSelectedSubject(e.target.value)}
                                                placeholder="Írd le miben segíthetek!"
                                                required
                                                style={{
                                                    background: 'white',
                                                    color: 'black',
                                                    fontWeight: '600',
                                                    border: '2px solid #39ff14'
                                                }}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="fileUpload">📎 Anyagok feltöltése (opcionális):</label>
                                            <div
                                                className={`file-upload-area ${isDragOver ? 'drag-over' : ''}`}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                            >
                                                <input
                                                    type="file"
                                                    id="fileUpload"
                                                    onChange={handleFileUpload}
                                                    multiple
                                                    accept="*/*"
                                                    style={{
                                                        background: 'white',
                                                        color: 'black',
                                                        fontWeight: '600',
                                                        border: '2px solid #39ff14',
                                                        padding: '8px'
                                                    }}
                                                />
                                                <div className="drag-drop-text">
                                                    <div className="drag-icon">📁</div>
                                                    <div className="drag-message">
                                                        Húzza ide a fájlokat, vagy kattintson a "Fájlok kiválasztása" gombra
                                                    </div>
                                                    <div className="drag-hint">
                                                        Támogatott formátumok: PDF, DOC, JPG, PNG, MP4, MP3, ZIP, stb. (Opcionális)
                                                    </div>
                                                </div>
                                            </div>
                                            {uploadedFiles.length > 0 && (
                                                <div className="uploaded-files">
                                                    <h4>Feltöltött fájlok:</h4>

                                                    {/* Dropbox upload gomb */}
                                                    <div className="dropbox-actions">
                                                        <button
                                                            type="button"
                                                            onClick={uploadAllToDropbox}
                                                            disabled={isUploadingToDropbox}
                                                            className="dropbox-upload-btn"
                                                            style={{
                                                                background: 'linear-gradient(45deg, #0061FE, #60EFFF)',
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: '8px 16px',
                                                                borderRadius: '8px',
                                                                cursor: isUploadingToDropbox ? 'not-allowed' : 'pointer',
                                                                marginBottom: '10px',
                                                                fontSize: '14px',
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            {isUploadingToDropbox ? '⏳ Dropbox feltöltés...' : '☁️ Dropbox feltöltés'}
                                                        </button>
                                                    </div>

                                                    {uploadedFiles.map((file, index) => (
                                                        <div key={index} className="file-item">
                                                            <div className="file-info">
                                                                <span>📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                                                                {dropboxLinks[index] && (
                                                                    <a
                                                                        href={dropboxLinks[index]}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="dropbox-link"
                                                                        style={{
                                                                            color: '#0061FE',
                                                                            textDecoration: 'none',
                                                                            marginLeft: '10px',
                                                                            fontSize: '12px'
                                                                        }}
                                                                    >
                                                                        🔗 Dropbox link
                                                                    </a>
                                                                )}
                                                            </div>
                                                            <div className="file-actions">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => downloadFile(file)}
                                                                    className="download-btn"
                                                                    style={{
                                                                        background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        padding: '4px 8px',
                                                                        borderRadius: '4px',
                                                                        cursor: 'pointer',
                                                                        marginRight: '5px',
                                                                        fontSize: '12px'
                                                                    }}
                                                                    title="Fájl letöltése"
                                                                >
                                                                    ⬇️ Letöltés
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeFile(index)}
                                                                    className="remove-file-btn"
                                                                    style={{
                                                                        background: 'linear-gradient(45deg, #f44336, #d32f2f)',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        padding: '4px 8px',
                                                                        borderRadius: '4px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '12px'
                                                                    }}
                                                                    title="Fájl törlése"
                                                                >
                                                                    ❌ Törlés
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="form-group terms-group">
                                            <label className="terms-label">
                                                <span className="terms-text">
                                                    Elfogadom a <a href="/terms" target="_blank" className="terms-link">Szabályzatot</a> és az <a href="/privacy" target="_blank" className="terms-link">Adatvédelmi Tájékoztatót</a>
                                                </span>
                                                <input
                                                    type="checkbox"
                                                    checked={acceptedTerms}
                                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                                    required
                                                    style={{
                                                        marginLeft: '10px',
                                                        transform: 'scale(1.2)'
                                                    }}
                                                />
                                            </label>
                                        </div>

                                        <div className="form-group">
                                            <label>Választott időpontok:</label>
                                            <div className="selected-info">
                                                <strong>{new Date(selectedDate).toLocaleDateString('hu-HU')}</strong>
                                                <div className="selected-times">
                                                    {selectedTimes.map((time, index) => (
                                                        <div key={index} className="selected-time">
                                                            {time} (30 perc - 5500 Ft)
                                                        </div>
                                                    ))}
                                                </div>
                                                {selectedTimes.length > 0 && (
                                                    <div className="total-price">
                                                        <strong>Összes ár: {selectedTimes.length * 5500} Ft</strong>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="submit-btn"
                                            disabled={isSubmitting || selectedTimes.length === 0 || !selectedSubject || !customerName || !customerEmail || !postalCode || !street || !houseNumber || !acceptedTerms}
                                        >
                                            {isSubmitting ? "Foglalás..." :
                                                selectedTimes.length === 0 || !selectedSubject || !customerName || !customerEmail || !postalCode || !street || !houseNumber || !acceptedTerms
                                                    ? "Töltse ki az összes kötelező mezőt!"
                                                    : `Foglalás: ${selectedTimes.length} időpont (${selectedTimes.length * 5500} Ft)`
                                            }
                                        </button>

                                        {selectedTimes.length > 0 && (
                                            <div className="calendar-buttons">
                                                <button
                                                    type="button"
                                                    className="calendar-btn google-calendar"
                                                    onClick={() => {
                                                        const firstTime = selectedTimes[0];
                                                        const eventDateTime = new Date(`${selectedDate}T${firstTime}`);
                                                        const endDateTime = new Date(eventDateTime.getTime() + selectedDuration * 60 * 60 * 1000);
                                                        const totalPrice = selectedTimes.length * 5500;

                                                        const eventTitle = `📚 Matekóra - ${customerName}`;
                                                        const eventDescription = `📚 Tantárgy: ${selectedSubject}
⏰ Időpontok: ${selectedTimes.join(', ')}
💰 Összes ár: ${totalPrice} Ft

👤 Foglaló: ${customerName}
📧 Email: ${customerEmail}
🏠 Lakcím: ${postalCode} ${street} ${houseNumber}
📎 Feltöltött fájlok: ${uploadedFiles.length > 0 ? uploadedFiles.map(f => f.name).join(', ') : 'Nincs'}`;

                                                        const formatDate = (date: Date) => {
                                                            const year = date.getFullYear();
                                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                                            const day = String(date.getDate()).padStart(2, '0');
                                                            const hours = String(date.getHours()).padStart(2, '0');
                                                            const minutes = String(date.getMinutes()).padStart(2, '0');
                                                            return `${year}${month}${day}T${hours}${minutes}00`;
                                                        };

                                                        const startDate = formatDate(eventDateTime);
                                                        const endDate = formatDate(endDateTime);

                                                        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent('Online Teams vagy Fóton')}`;

                                                        window.open(googleCalendarUrl, '_blank');
                                                    }}
                                                >
                                                    📅 Google Calendar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="calendar-btn apple-calendar"
                                                    onClick={() => {
                                                        const firstTime = selectedTimes[0];
                                                        const eventDateTime = new Date(`${selectedDate}T${firstTime}`);
                                                        const endDateTime = new Date(eventDateTime.getTime() + selectedDuration * 60 * 60 * 1000);
                                                        const totalPrice = selectedTimes.length * 5500;

                                                        const eventTitle = `📚 Matekóra - ${customerName}`;
                                                        const eventDescription = `📚 Tantárgy: ${selectedSubject}
⏰ Időpontok: ${selectedTimes.join(', ')}
💰 Összes ár: ${totalPrice} Ft

👤 Foglaló: ${customerName}
📧 Email: ${customerEmail}
🏠 Lakcím: ${postalCode} ${street} ${houseNumber}
📎 Feltöltött fájlok: ${uploadedFiles.length > 0 ? uploadedFiles.map(f => f.name).join(', ') : 'Nincs'}`;

                                                        addToAppleCalendar(eventTitle, eventDateTime, endDateTime, eventDescription);
                                                    }}
                                                >
                                                    🍎 Apple Calendar
                                                </button>
                                            </div>
                                        )}



                                        {submitMessage && (
                                            <div className="message">
                                                {submitMessage}
                                                {submitMessage.includes('Sikeres') && selectedTimes.length > 0 && (
                                                    <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                                        <p style={{ marginBottom: '10px', fontSize: '14px', color: '#39ff14' }}>
                                                            📅 <strong>Adja hozzá a naptárához:</strong>
                                                        </p>
                                                        <div className="calendar-buttons">
                                                            <button
                                                                type="button"
                                                                className="calendar-btn google-calendar"
                                                                onClick={() => {
                                                                    const firstTime = selectedTimes[0];
                                                                    const eventDateTime = new Date(`${selectedDate}T${firstTime}`);
                                                                    const endDateTime = new Date(eventDateTime.getTime() + selectedDuration * 60 * 60 * 1000);
                                                                    const totalPrice = selectedTimes.length * 5500;

                                                                    const eventTitle = `📚 Matekóra - ${customerName}`;
                                                                    const eventDescription = `📚 Tantárgy: ${selectedSubject}
⏰ Időpontok: ${selectedTimes.join(', ')}
💰 Összes ár: ${totalPrice} Ft

👤 Foglaló: ${customerName}
📧 Email: ${customerEmail}
🏠 Lakcím: ${postalCode} ${street} ${houseNumber}
📎 Feltöltött fájlok: ${uploadedFiles.length > 0 ? uploadedFiles.map(f => f.name).join(', ') : 'Nincs'}`;

                                                                    const formatDate = (date: Date) => {
                                                                        const year = date.getFullYear();
                                                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                                                        const day = String(date.getDate()).padStart(2, '0');
                                                                        const hours = String(date.getHours()).padStart(2, '0');
                                                                        const minutes = String(date.getMinutes()).padStart(2, '0');
                                                                        return `${year}${month}${day}T${hours}${minutes}00`;
                                                                    };

                                                                    const startDate = formatDate(eventDateTime);
                                                                    const endDate = formatDate(endDateTime);

                                                                    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent('Online Teams vagy Fóton')}`;

                                                                    window.open(googleCalendarUrl, '_blank');
                                                                }}
                                                            >
                                                                📅 Google Calendar
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="calendar-btn apple-calendar"
                                                                onClick={() => {
                                                                    const firstTime = selectedTimes[0];
                                                                    const eventDateTime = new Date(`${selectedDate}T${firstTime}`);
                                                                    const endDateTime = new Date(eventDateTime.getTime() + selectedDuration * 60 * 60 * 1000);
                                                                    const totalPrice = selectedTimes.length * 5500;

                                                                    const eventTitle = `📚 Matekóra - ${customerName}`;
                                                                    const eventDescription = `📚 Tantárgy: ${selectedSubject}
⏰ Időpontok: ${selectedTimes.join(', ')}
💰 Összes ár: ${totalPrice} Ft

👤 Foglaló: ${customerName}
📧 Email: ${customerEmail}
🏠 Lakcím: ${postalCode} ${street} ${houseNumber}
📎 Feltöltött fájlok: ${uploadedFiles.length > 0 ? uploadedFiles.map(f => f.name).join(', ') : 'Nincs'}`;

                                                                    addToAppleCalendar(eventTitle, eventDateTime, endDateTime, eventDescription);
                                                                }}
                                                            >
                                                                🍎 Apple Calendar
                                                            </button>
                                                        </div>
                                                        <p style={{ marginTop: '8px', fontSize: '12px', color: '#ff49db', opacity: 0.8 }}>
                                                            💡 <strong>Apple Calendar:</strong> ICS fájl letöltése, majd megnyitása az iPhone/Apple eszközön
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </form>
                                </div>

                                {/* Info Panel */}
                                <div className="info-panel">
                                    <div className="info-card">
                                        <h4>📅 Foglalási információk</h4>
                                        <ul>
                                            <li><strong>Hétfő - Péntek:</strong> 9:00 - 20:00</li>
                                            <li><strong>Szombat:</strong> 10:00 - 16:00</li>
                                            <li><strong>Ár:</strong> 11.000 Ft/60 perc</li>
                                            <li><strong>Helyszín:</strong> Online Teams-en keresztül vagy élőben Fóton</li>
                                            <li><strong>Fizetés:</strong> Készpénzzel vagy utalással</li>
                                            <li><strong>Utalás:</strong> Lieszkofszki Zsolt</li>
                                            <li><strong>Számlaszám:</strong> 10401000-86765086-50861000</li>
                                            <li><strong>Közlemény:</strong> Számla sorszáma</li>
                                            <li><strong>Naptár:</strong> Google Calendar és Apple Calendar gombok a foglalási űrlapban</li>
                                            <li><strong>Lemondási szabály:</strong> 24 órával előtte lemondható, különben teljes díj</li>
                                        </ul>
                                    </div>


                                </div>
                            </div>
                        )}

                        <CookieBanner />
                    </div>
                </section>
            </div>

            <style jsx>{`
                .booking-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, rgba(10, 10, 10, 0.8) 0%, rgba(26, 26, 46, 0.8) 50%, rgba(22, 33, 62, 0.8) 100%), url('/időpontfoglalás.png');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    color: white;
                    font-family: 'Montserrat', sans-serif;
                }

                /* NAVBAR */
                nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 2rem;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }

                .logo svg {
                    filter: drop-shadow(0 0 10px rgba(57, 255, 20, 0.5));
                }

                .nav-links {
                    display: flex;
                    list-style: none;
                    gap: 2rem;
                    margin: 0;
                    padding: 0;
                }

                .nav-links a, .nav-links span {
                    color: white;
                    text-decoration: none;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                }

                .nav-links a:hover, .nav-links span:hover {
                    color: #39ff14;
                    background: rgba(57, 255, 20, 0.1);
                }

                .booking-link.active {
                    color: #39ff14;
                    background: rgba(57, 255, 20, 0.2);
                }

                .nav-toggle {
                    display: none;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                }

                /* CALENDAR SECTION */
                .calendar-section {
                    padding: 2rem;
                }

                .section-content {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .calendar-container {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                    padding: 2rem;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(57, 255, 20, 0.2);
                }

                .calendar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .calendar-nav {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .nav-btn, .today-btn {
                    background: linear-gradient(135deg, #39ff14, #00ff88);
                    border: none;
                    color: black;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .nav-btn:hover, .today-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(57, 255, 20, 0.3);
                }

                .calendar-loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 300px;
                    margin-bottom: 2rem;
                }

                .loading-spinner {
                    color: #39ff14;
                    font-size: 1.2rem;
                    font-weight: 600;
                    animation: pulse 1.5s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }

                .calendar-weekdays {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }

                .weekday {
                    text-align: center;
                    font-weight: 600;
                    color: #39ff14;
                    padding: 0.5rem;
                }

                .calendar-days {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 0.5rem;
                }

                .calendar-day {
                    aspect-ratio: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    border: 2px solid transparent;
                    color: white;
                }

                .day-number {
                    color: white;
                    font-weight: 600;
                }

                .calendar-day.clickable:hover {
                    background: rgba(57, 255, 20, 0.1);
                    border-color: #39ff14;
                    transform: scale(1.05);
                }

                .calendar-day.selected {
                    background: linear-gradient(135deg, #39ff14, #00ff88);
                    color: black;
                    font-weight: 600;
                }

                .calendar-day.selected .day-number {
                    color: black;
                }

                .calendar-day.today {
                    border-color: #ff49db;
                    background: rgba(255, 73, 219, 0.1);
                }

                .calendar-day.past {
                    opacity: 0.3;
                    cursor: not-allowed;
                    color: rgba(255, 255, 255, 0.3);
                }

                .calendar-day.clickable {
                    color: white;
                }

                .calendar-day.other-month {
                    opacity: 0.5;
                    color: rgba(255, 255, 255, 0.5);
                }

                .today-indicator {
                    position: absolute;
                    bottom: 2px;
                    width: 6px;
                    height: 6px;
                    background: #ff49db;
                    border-radius: 50%;
                }

                /* TIME SLOTS */
                .time-slots-container {
                    margin-top: 2rem;
                }

                .selected-date-info {
                    text-align: center;
                    margin-bottom: 1.5rem;
                }

                .selected-date-info h3 {
                    color: #39ff14;
                    margin-bottom: 1rem;
                }

                .time-slots h4 {
                    color: #39ff14;
                    margin-bottom: 1rem;
                }

                .slots-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 0.5rem;
                    margin-bottom: 2rem;
                }

                .time-slot {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(57, 255, 20, 0.3);
                    border-radius: 12px;
                    padding: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                    position: relative;
                    min-height: 50px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                .time-text {
                    font-weight: 600;
                    margin-bottom: 2px;
                }

                .booking-count {
                    font-size: 0.7rem;
                    color: #ff49db;
                    font-weight: 500;
                    background: rgba(255, 73, 219, 0.1);
                    padding: 2px 6px;
                    border-radius: 4px;
                    margin-top: 2px;
                }

                .selected-indicator {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background: #39ff14;
                    color: #000;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                }

                .time-slot.available:hover {
                    background: rgba(57, 255, 20, 0.2);
                    border-color: #39ff14;
                    transform: translateY(-2px);
                }

                .time-slot.selected {
                    background: linear-gradient(135deg, #39ff14, #00ff88);
                    color: black;
                    font-weight: 600;
                }

                .time-slot.unavailable {
                    opacity: 0.3;
                    cursor: not-allowed;
                    background: rgba(255, 0, 0, 0.1);
                    border-color: #ff0000;
                    color: #ff0000;
                }

                .time-slot.booked {
                    opacity: 0.3;
                    cursor: not-allowed;
                    background: rgba(255, 0, 0, 0.3);
                    border-color: #ff0000;
                    color: #ff0000;
                    position: relative;
                    pointer-events: none;
                }

                .time-slot.booked::after {
                    content: 'FOGLALT';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 0.7rem;
                    font-weight: bold;
                    background: rgba(255, 0, 0, 0.9);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 6px;
                    z-index: 10;
                }

                /* BOOKING SECTION */
                .booking-section {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    margin-top: 2rem;
                }

                /* BOOKING FORM */
                .booking-form-container {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    padding: 2rem;
                    border: 1px solid rgba(57, 255, 20, 0.2);
                }

                .booking-form-container h3 {
                    color: #39ff14;
                    margin-bottom: 1.5rem;
                    text-align: center;
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #39ff14;
                }

                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #39ff14;
                    border-radius: 8px;
                    background: white !important;
                    color: black !important;
                    font-size: 1rem;
                    font-family: inherit;
                    font-weight: 600;
                }

                /* Force black text on all inputs */
                input[type="text"],
                input[type="email"],
                input[type="tel"],
                input[type="number"],
                textarea {
                    color: black !important;
                    background: white !important;
                }

                .form-group textarea {
                    resize: vertical;
                    min-height: 80px;
                }

                .form-group input:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #ff49db;
                    box-shadow: 0 0 10px rgba(255, 73, 219, 0.3);
                    background: white !important;
                    color: black !important;
                }

                .form-group input::placeholder,
                .form-group textarea::placeholder {
                    color: #666 !important;
                }

                /* Additional force rules */
                .booking-form input,
                .booking-form textarea {
                    color: black !important;
                    background: white !important;
                }

                .booking-form input::placeholder,
                .booking-form textarea::placeholder {
                    color: #666 !important;
                }

                .selected-info {
                    background: rgba(57, 255, 20, 0.1);
                    border: 1px solid #39ff14;
                    border-radius: 8px;
                    padding: 1rem;
                    margin-top: 0.5rem;
                    color: #ff49db;
                }

                .selected-info strong {
                    color: white;
                }

                .selected-times {
                    margin-top: 10px;
                }

                .selected-time {
                    background: rgba(57, 255, 20, 0.1);
                    border: 1px solid #39ff14;
                    border-radius: 6px;
                    padding: 8px 12px;
                    margin-bottom: 5px;
                    color: #ff49db;
                    font-weight: 500;
                }

                .total-price {
                    margin-top: 15px;
                    padding: 10px;
                    background: rgba(255, 73, 219, 0.1);
                    border: 1px solid #ff49db;
                    border-radius: 8px;
                    color: #ff49db;
                    text-align: center;
                }

                .submit-btn {
                    width: 100%;
                    padding: 1rem;
                    background: linear-gradient(135deg, #39ff14, #00ff88);
                    color: black;
                    border: none;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 1rem;
                }

                .submit-btn:disabled {
                    background: linear-gradient(135deg, #9e9e9e, #757575);
                    color: #e0e0e0;
                    cursor: not-allowed;
                    opacity: 0.7;
                }

                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(57, 255, 20, 0.3);
                }

                .calendar-buttons {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                    justify-content: center;
                }

                .calendar-btn {
                    padding: 10px 15px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    flex: 1;
                }

                .google-calendar {
                    background: linear-gradient(135deg, #4285f4, #34a853);
                    color: white;
                }

                .google-calendar:hover {
                    background: linear-gradient(135deg, #3367d6, #2d8f47);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
                }

                .apple-calendar {
                    background: linear-gradient(135deg, #000000, #333333);
                    color: white;
                }

                .apple-calendar:hover {
                    background: linear-gradient(135deg, #1a1a1a, #404040);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }



                .message {
                    margin-top: 1rem;
                    padding: 1rem;
                    border-radius: 8px;
                    text-align: center;
                    font-weight: 500;
                }

                .message:not(:empty) {
                    background: rgba(57, 255, 20, 0.1);
                    border: 1px solid #39ff14;
                    color: #ff49db;
                }

                .message a {
                    color: #39ff14;
                    text-decoration: underline;
                    font-weight: 600;
                }

                .message a:hover {
                    color: #00ff88;
                }

                /* FILE UPLOAD */
                .file-upload-area {
                    position: relative;
                    border: 2px dashed #39ff14;
                    border-radius: 12px;
                    padding: 30px;
                    text-align: center;
                    background: rgba(57, 255, 20, 0.05);
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .file-upload-area.drag-over {
                    border-color: #ff49db;
                    background: rgba(255, 73, 219, 0.1);
                    transform: scale(1.02);
                    box-shadow: 0 0 20px rgba(255, 73, 219, 0.3);
                }

                .file-upload-area input[type="file"] {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    cursor: pointer;
                    z-index: 2;
                }

                .drag-drop-text {
                    position: relative;
                    z-index: 1;
                    pointer-events: none;
                }

                .drag-icon {
                    font-size: 3rem;
                    margin-bottom: 15px;
                    animation: bounce 2s infinite;
                }

                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-10px);
                    }
                    60% {
                        transform: translateY(-5px);
                    }
                }

                .drag-message {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #39ff14;
                    margin-bottom: 10px;
                }

                .drag-hint {
                    font-size: 0.9rem;
                    color: rgba(57, 255, 20, 0.7);
                    font-style: italic;
                }

                .file-upload-area:hover {
                    border-color: #ff49db;
                    background: rgba(255, 73, 219, 0.05);
                }

                .uploaded-files {
                    margin-top: 15px;
                    padding: 15px;
                    background: rgba(57, 255, 20, 0.1);
                    border: 1px solid #39ff14;
                    border-radius: 8px;
                }

                .uploaded-files h4 {
                    margin-bottom: 10px;
                    color: #39ff14;
                    font-size: 1rem;
                }

                .file-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px;
                    margin: 8px 0;
                    background: rgba(255, 255, 255, 0.9);
                    border: 1px solid #39ff14;
                    border-radius: 8px;
                    color: black;
                    font-weight: 500;
                }

                .file-info {
                    display: flex;
                    align-items: center;
                    flex: 1;
                }

                .file-actions {
                    display: flex;
                    gap: 5px;
                }

                .dropbox-actions {
                    margin-bottom: 15px;
                    text-align: center;
                }

                .dropbox-link {
                    transition: all 0.3s ease;
                }

                .dropbox-link:hover {
                    text-decoration: underline !important;
                    color: #60EFFF !important;
                }

                .remove-file-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1.2rem;
                    padding: 4px 8px;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                }

                .remove-file-btn:hover {
                    background: rgba(255, 0, 0, 0.1);
                    transform: scale(1.1);
                }

                /* TERMS */
                .terms-group {
                    margin-top: 25px;
                    padding: 15px;
                    background: rgba(57, 255, 20, 0.1);
                    border: 1px solid #39ff14;
                    border-radius: 8px;
                }

                .terms-label {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    color: white;
                    font-weight: 500;
                    flex-direction: row;
                }

                .terms-text {
                    line-height: 1.5;
                }

                .terms-link {
                    color: #ff49db;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .terms-link:hover {
                    color: #39ff14;
                    text-decoration: underline;
                }

                /* INFO PANEL */
                .info-panel {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }

                .info-card {
                    background: rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 1.5rem;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(15px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease;
                }

                .info-card:hover {
                    background: rgba(255, 255, 255, 0.12);
                    border-color: rgba(57, 255, 20, 0.4);
                    transform: translateY(-2px);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
                }

                .info-card h4 {
                    color: #39ff14;
                    margin-bottom: 1rem;
                    font-size: 1.2rem;
                }

                .info-card ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .info-card li {
                    margin-bottom: 0.5rem;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    color: #ff49db;
                }

                .info-card li strong {
                    color: white;
                }

                .info-card li:last-child {
                    border-bottom: none;
                }

                /* RESPONSIVE */
                @media (max-width: 768px) {
                    .booking-section {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }

                    .info-panel {
                        grid-template-columns: 1fr;
                    }

                    .nav-links {
                        display: none;
                    }

                    .nav-toggle {
                        display: block;
                    }

                    .calendar-section {
                        padding: 1rem;
                    }

                    .calendar-container {
                        padding: 1rem;
                    }

                    .slots-grid {
                        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                    }

                    .info-panel {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </>
    );
}
