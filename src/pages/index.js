import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Howl } from "howler";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const soundCategories = {
  "Nature Sounds": [
    { name: "Ocean Waves", url: "/sounds/ocean.mp3", icon: "🌊" },
    { name: "Rain Drops", url: "/sounds/rain.mp3", icon: "🌧️" },
    { name: "Heavy Rain", url: "/sounds/heavy-rain.mp3", icon: "⛈️" },
    { name: "Cricket", url: "/sounds/cricket.mp3", icon: "🦗" },
  ],
  "Meditation & Focus": [
    { name: "Meditation Bowl 1", url: "/sounds/meditation.mp3", icon: "🎶" },
    { name: "Meditation Bowl 2", url: "/sounds/meditation-2.mp3", icon: "🎵" },
    { name: "Alpha Waves", url: "/sounds/binaural/alpha.mp3", icon: "❤️" },
    { name: "Theta Waves", url: "/sounds/binaural/theta.mp3", icon: "💚" },
  ],
  "Ambient Sounds": [
    { name: "Bustling Cafe", url: "/sounds/cafe.mp3", icon: "☕" },
    { name: "Fireplace", url: "/sounds/fireplace.mp3", icon: "🔥" },
    { name: "Nature", url: "/sounds/nature.mp3", icon: "🍀" },
  ]
};


const getRandomSessionName = () => {
  const adjectives = ["Calm", "Focus", "Zen", "Relaxing", "Deep", "Soothing"];
  const nouns = ["Session", "Vibes", "Ambience", "Mix", "Atmosphere"];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
};

const backgrounds = [
  { name: "Matte Black", className: "bg-black" },
  { name: "Cozy Room", className: "bg-[url('/images/cozy.jpg')] bg-cover" },
  { name: "Anime Sunset", className: "bg-[url('/images/anime-sunset.jpg')] bg-cover" },
  { name: "Moving Lava Lamp", className: "lava-lamp", animated: true },
];

const quotes = [
  "Breathe in peace, exhale stress.",
  "Let the sound guide you to serenity.",
  "Relax, unwind, and just be.",
  "Tranquility is just a sound away."
];

export default function AmbienceApp() {
  const [selectedSounds, setSelectedSounds] = useState([]);
  const [volumes, setVolumes] = useState({});
  const [background, setBackground] = useState(backgrounds[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fallbackSource, setFallbackSource] = useState(null);
  const [activeTab, setActiveTab] = useState("Ambience");
  const [sessions, setSessions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [sessionName, setSessionName] = useState(getRandomSessionName());
  const [time, setTime] = useState(25 * 60);
  const [mode, setMode] = useState("focus");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning]);

  const startTimer = (duration, mode) => {
    setTime(duration * 60);
    setIsRunning(true);
    setMode(mode);
  };

  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem("savedSessions")) || [];
    setSessions(savedSessions);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSession = localStorage.getItem("savedSession");
      if (savedSession) {
        const parsedSession = JSON.parse(savedSession);
        setSelectedSounds(parsedSession.sounds || []);
        setVolumes(parsedSession.volumes || {});
      }
    }
  }, []);

  const saveSession = () => {
    const newSession = {
      name: sessionName,
      background: background.name,
      sounds: selectedSounds.map((s) => ({
        name: s.name,
        volume: volumes[s.name] || 1,
        url: s.url
      })),
    };
    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    localStorage.setItem("savedSessions", JSON.stringify(updatedSessions));
  };

  const restoreSession = (session) => {
    const bg = backgrounds.find((b) => b.name === session.background);
    setBackground(bg);
    let restoredSelectedSounds = []
    setSelectedSounds(restoredSelectedSounds);

    session.sounds.forEach((s) => {
      restoredSelectedSounds.push({ ...s, howl: new Howl({ src: [s.url], loop: true }) });
    })

    session.sounds.forEach((s) => {
      const sound = Object.values(soundCategories).flat().find((so) => so.name === s.name);
      if (sound) {
        setVolumes((prev) => ({ ...prev, [s.name]: s.volume }));
      }
    });
    setSelectedSounds(restoredSelectedSounds)
  };

  const handleToggleSound = (sound) => {
    const isSelected = selectedSounds.find((s) => s.name === sound.name);
    if (isSelected) {
      handleRemoveSound(sound);
    } else {
      handleAddSound(sound);
    }
  };

  const deleteSession = (index) => {
    const updatedSessions = sessions.filter((_, i) => i !== index);
    setSessions(updatedSessions);
    localStorage.setItem("savedSessions", JSON.stringify(updatedSessions));
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const handleAddSound = (sound) => {
    if (!selectedSounds.find((s) => s.name === sound.name)) {
      const howl = new Howl({
        src: [sound.url],
        loop: true,
        onloaderror: () => {
          console.error(`Sound file not found: ${sound.url}`);
        },
      });
      setSelectedSounds([...selectedSounds, { ...sound, howl }]);
      console.log(selectedSounds);
    }
  };

  const handleRemoveSound = (sound) => {
    setSelectedSounds(selectedSounds.filter((s) => s.name !== sound.name));
    // sound.howl.stop();
    if (fallbackSource) {
      fallbackSource.stop();
      setFallbackSource(null);
    }
  };

  const handleVolumeChange = (sound, volume) => {
    setVolumes({ ...volumes, [sound.name]: volume });
    sound.howl.volume(volume);
  };

  const handleBackgroundChange = (bg) => {
    setBackground(bg);
  };

  const togglePlayPause = () => {
    if (selectedSounds.length === 0) return;
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      selectedSounds.forEach((sound) => sound.howl.play());
    } else {
      selectedSounds.forEach((sound) => sound.howl.pause());
    }
  };

  useEffect(() => {
    selectedSounds.forEach((sound) => {
      sound.howl.play();
      sound.howl.volume(volumes[sound.name] || 0.5);
    });

    return () => {
      selectedSounds.forEach((sound) => sound.howl.stop());
      if (fallbackSource) fallbackSource.stop();
    };
  }, [selectedSounds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full ${background.className} flex flex-col items-center justify-center bg-fixed bg-no-repeat bg-cover transition-none  ease-in-out duration-700`}
    >
      {background.animated && <><div className="lava-lamp-2" /><div className="lava-lamp-3" /></>}
      <nav className="flex w-full justify-center justify-items-center gap-6 py-8 px-10 bg-transparent text-white fixed top-0 backdrop-blur-md z-50">
        <div className=" text-4xl"><b>Echo</b>Scape</div>
        <div className="w-full"></div>
        {["Ambience", "Pomodoro"].map((tab) => (
          <button
            key={tab}
            className={`p-2 text-lg rounded-lg transition ${activeTab === tab ? "font-bold" : "font-normal"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
        <button onClick={() => setModalOpen(true)} className="text-white p-2 text-lg rounded-lg z-30">💾</button>
      </nav>

      {activeTab === "Ambience" && (
        <div className="h-full w-full bg-opacity-80 flex flex-col items-center text-white mt-32 px-6 md:px-12 py-4 md:py-12 z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 md:mb-8 tracking-wide text-center">
            Create Your Perfect Ambience
          </h1>
          <p className="text-lg md:text-2xl italic mb-10 text-center ease-in-out transition-all">{`"${quotes[quoteIndex]}"`}</p>

          {/* Background Selection */}
          <div className="flex justify-center p-2 rounded-lg">
            {backgrounds.map((bg) => (
              <button
                key={bg.name}
                className={`px-4 py-2 ${backgrounds.indexOf(bg) == 0 ? "rounded-l-lg" : backgrounds.indexOf(bg) == backgrounds.length - 1 ? "rounded-r-lg" : "rounded-none"} shadow-xl font-medium ${background.name === bg.name
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300"
                  }`}
                onClick={() => handleBackgroundChange(bg)}
              >
                {bg.name}
              </button>
            ))}
          </div>
          <div className="mt-10">
            {Object.entries(soundCategories).map(([category, sounds]) => (
              <div key={category} className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{category}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {sounds.map((sound) => (
                    <Card
                      key={sound.name}
                      className={`bg-gray-900 backdrop-blur-md bg-opacity-50 rounded-lg md:rounded-xl shadow-xl p-4 md:p-6 flex flex-col items-center transition-transform transform hover:scale-105 ${selectedSounds.find((s) => s.name === sound.name)
                        ? "border-2 border-blue-500"
                        : "border border-transparent"
                        }`}
                    >
                      <div
                        className="text-2xl md:text-3xl mb-2 text-center cursor-pointer"
                        onClick={() => handleToggleSound(sound)}
                      >
                        {sound.icon}
                      </div>
                      <h3 className="text-sm md:text-base font-medium text-center mb-4">{sound.name}</h3>
                      <Slider
                        defaultValue={(volumes[sound.name] || 0.5) * 100}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => handleVolumeChange(selectedSounds.filter((s) => s.name === sound.name)[0], value / 100)}
                      />
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Pomodoro" && (
        <div className={`h-screen w-full bg-opacity-60 bg-slate-800 flex flex-col items-center text-white px-6 md:px-12 pb-4 md:pb-12 ${mode ? mode + "-waves" : ""} transition-all justify-center duration-700 ease-in-out z-10`}>
          <div className="text-[10rem] mb-5 font-bold">{Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}</div>
          <div className="mt-4 flex p-2 rounded-lg">
            <Button className="bg-slate-200 bg-opacity-20 backdrop-blur-md text-slate-200 text-sm border-transparent border-4 border-opacity-20 px-4 py-2 rounded-l-lg rounded-r-none" onClick={() => startTimer(25, "focus")}>Focus</Button>
            <Button className="bg-slate-200 bg-opacity-20 backdrop-blur-md text-slate-200 text-sm border-transparent border-4 border-opacity-20 px-4 py-2 rounded-none" onClick={() => startTimer(5, "short-break")}>Short Break</Button>
            <Button className="bg-slate-200 bg-opacity-20 backdrop-blur-md text-slate-200 text-sm border-transparent border-4 border-opacity-20 px-4 py-2 rounded-none" onClick={() => startTimer(15, "long-break")}>Long Break</Button>
            <Button className="bg-slate-200 bg-opacity-20 backdrop-blur-md text-slate-200 text-sm border-transparent border-4 border-opacity-20 px-4 py-2 rounded-none" onClick={() => { setIsRunning(false); setTime(25 * 60); setMode(null); }}>Reset</Button>
            <Button className="bg-slate-200 bg-opacity-20 backdrop-blur-md text-slate-200 text-sm border-transparent border-4 border-opacity-20 px-4 py-2 rounded-l-none rounded-r-lg" onClick={() => setIsRunning(!isRunning)}>{isRunning ? "Pause" : "Start"}</Button>
          </div>

        </div>
      )}

      {/* Fullscreen Button */}
      <div className="fixed bottom-4 right-4 flex gap-4 z-50">
        <button
          onClick={toggleFullScreen}
          className="bg-gray-800 text-white backdrop-blur-md bg-opacity-50 py-2 px-4 rounded-lg hover:backdrop-blur-lg shadow-lg"
        >
          ⛶
        </button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <div className="p-2 bg-gray-900 text-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Sessions</h2>
          <div className="flex items-center gap-2 mb-4">
            <Input value={sessionName} onChange={(e) => setSessionName(e.target.value)} className="p-2 text-white" />
            <Button onClick={() => setSessionName(getRandomSessionName())} className="bg-gray-700 text-white p-2">🔄</Button>
          </div>
          <Button onClick={saveSession} className="bg-green-500 text-white px-4 py-2 rounded-lg mb-8">Save Current Session</Button>
          <h3 className="text-md mb-2">Restore or Delete Sessions</h3>
          {sessions.length > 0 ? (
            sessions.map((session, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <Button onClick={() => restoreSession(session)} className="bg-gray-700 text-white px-4 py-2 mr-2">{session.name}</Button>
                <Button onClick={() => deleteSession(index)} className="bg-red-500 text-white px-4 py-2">🗑</Button>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No saved sessions</p>
          )}
        </div>
      </Dialog>

    </div>
  );
}
