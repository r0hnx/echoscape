import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Howl } from "howler";

const soundOptions = [
  { name: "Ocean Waves", url: "/sounds/ocean.mp3", icon: "🌊" },
  { name: "Rain Drops", url: "/sounds/rain.mp3", icon: "🌧️" },
  { name: "Meditation Bowl 1", url: "/sounds/meditation.mp3", icon: "🎶" },
  { name: "Meditation Bowl 2", url: "/sounds/meditation-2.mp3", icon: "🎵" },
  { name: "Bustling Cafe", url: "/sounds/cafe.mp3", icon: "☕" },
  { name: "Cricket", url: "/sounds/cricket.mp3", icon: "🦗" },
  { name: "Fireplace", url: "/sounds/fireplace.mp3", icon: "🔥" },
  { name: "Nature", url: "/sounds/nature.mp3", icon: "🍀" },
  { name: "Heavy Rain", url: "/sounds/heavy-rain.mp3", icon: "⛈️" },
  { name: "Alpha", url: "/sounds/binaural/alpha.mp3", icon: "❤️" },
  { name: "Beta", url: "/sounds/binaural/beta.mp3", icon: "🤍" },
  { name: "Theta", url: "/sounds/binaural/theta.mp3", icon: "💚" },
  { name: "Delta", url: "/sounds/binaural/delta.mp3", icon: "💛" },
  { name: "Gamma", url: "/sounds/binaural/gamma.mp3", icon: "💜" }
];

const backgrounds = [
  { name: "Matte Black", className: "bg-black" },
  { name: "Cozy Room", className: "bg-[url('/images/cozy.jpg')] bg-cover" },
  { name: "Anime Sunset", className: "bg-[url('/images/anime-sunset.jpg')] bg-cover" },
  { name: "Moving Lava Lamp", className: "animated-lava-lamp", animated: true },
];

const quotes = [
  "Breathe in peace, exhale stress.",
  "Let the sound guide you to serenity.",
  "Relax, unwind, and just be.",
  "Tranquility is just a sound away."
];

export default function BackgroundMusicMixer() {
  const [selectedSounds, setSelectedSounds] = useState([]);
  const [volumes, setVolumes] = useState({ [soundOptions[1].name]: 0.5 });
  const [background, setBackground] = useState(backgrounds[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fallbackSource, setFallbackSource] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = (sound) => {
    const isSelected = selectedSounds.find((s) => s.name === sound.name);
    if (isSelected) {
      handleRemoveSound(sound);
    } else {
      handleAddSound(sound);
    }
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

  return (
    <div
      className={`min-h-screen w-full ${background.className} flex flex-col items-center justify-center bg-fixed bg-no-repeat bg-cover`}
    >
      <style>{`
        .animated-lava-lamp {
          background: linear-gradient(135deg, rgba(255, 105, 180, 0.6), rgba(255, 140, 0, 0.6), rgba(70, 130, 180, 0.6), rgba(255, 69, 0, 0.6), rgba(138, 43, 226, 0.6));
          background-size: 300% 300%;
          animation: lavaLamp 12s ease infinite;
        }

        @keyframes lavaLamp {
          0% { background-position: 0% 50%; }
          25% { background-position: 50% 100%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 0%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div className="h-full w-full bg-opacity-80 backdrop-blur-sm flex flex-col items-center text-white px-6 md:px-12 py-8 md:py-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 md:mb-8 tracking-wide text-center">
          Create Your Perfect Ambience
        </h1>
        <p className="text-lg md:text-2xl italic mb-10 md:mb-4 text-center ease-in-out transition-all">{quotes[quoteIndex]}</p>

        {/* Background Selection */}
        <div className="flex justify-center gap-4 md:gap-6 mb-10 md:mb-14">
          {backgrounds.map((bg) => (
            <button
              key={bg.name}
              className={`p-2 md:p-2 text-sm md:text-lg rounded-lg md:rounded-xl shadow-xl font-medium transition-transform transform hover:scale-105 ${background.name === bg.name
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300"
                }`}
              onClick={() => handleBackgroundChange(bg)}
            >
              {bg.name}
            </button>
          ))}
        </div>
        {/* Sound Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mb-10 md:mb-16">
          {soundOptions.map((sound) => (
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

        {/* Play/Pause Button */}
        {/* <div className="mt-10 md:mt-16">
          <Button
            disabled={selectedSounds.length === 0}
            className={`${selectedSounds.length === 0 ? "bg-gray-600" : "bg-green-500 hover:bg-green-400"
              } text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-medium text-lg md:text-xl shadow-md`}
            onClick={togglePlayPause}
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>
        </div> */}

        {/* Fullscreen Button */}
        <div className="fixed top-4 right-4 flex gap-4">
          <button
            onClick={toggleFullScreen}
            className="bg-gray-800 text-white backdrop-blur-md bg-opacity-50 py-2 px-4 rounded-lg hover:backdrop-blur-lg shadow-lg"
          >
            ⛶
          </button>
        </div>
      </div>
    </div>
  );
}
