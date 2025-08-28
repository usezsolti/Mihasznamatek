import React, { useState, useEffect } from 'react';

interface BillboardData {
    year: string;
    title: string;
    description: string;
}

const billboardData: BillboardData[] = [
    {
        year: '2015',
        title: 'Mechatronikai Mérnök',
        description: 'BME - Gépészmérnöki Kar'
    },
    {
        year: '2017',
        title: 'Mérnökinformatikus',
        description: 'BME - Villamosmérnöki és Informatikai Kar'
    },
    {
        year: '2019',
        title: 'Matematika Tanár',
        description: 'ELTE - Természettudományi Kar'
    },
    {
        year: '2021',
        title: 'Sportoktató',
        description: 'Testnevelési és Sporttudományi Kar'
    },
    {
        year: '2023',
        title: 'MIHASZNA Matek',
        description: 'Saját matek tanítási vállalkozás'
    }
];

const UnityRoadGame: React.FC = () => {
    const [currentBillboard, setCurrentBillboard] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [Unity, setUnity] = useState<any>(null);
    const [UnityContext, setUnityContext] = useState<any>(null);
    const [unityContext, setUnityContextInstance] = useState<any>(null);

    useEffect(() => {
        // Csak kliens oldalon töltse be a Unity-t
        setIsClient(true);

        const loadUnity = async () => {
            try {
                const unityModule = await import('react-unity-webgl');
                setUnity(unityModule.default);

                // Unity Context létrehozása - a react-unity-webgl-ban a UnityContext egy osztály
                const UnityContext = unityModule.UnityContext || unityModule.default.UnityContext;
                setUnityContext(UnityContext);

                // Unity Context létrehozása
                const context = new UnityContext({
                    loaderUrl: "/unity-game/Build/Build.loader.js",
                    dataUrl: "/unity-game/Build/Build.data",
                    frameworkUrl: "/unity-game/Build/Build.framework.js",
                    codeUrl: "/unity-game/Build/Build.wasm",
                });

                setUnityContextInstance(context);

                // Unity event listeners
                context.on("progress", (progress: number) => {
                    setProgress(progress);
                });

                context.on("loaded", () => {
                    setIsLoading(false);
                    console.log("Unity játék betöltve!");
                });

                context.on("billboardChanged", (index: number) => {
                    setCurrentBillboard(index);
                });
            } catch (error) {
                console.error("Unity betöltési hiba:", error);
                setIsLoading(false);
            }
        };

        loadUnity();

        // Cleanup
        return () => {
            if (unityContext) {
                unityContext.removeAllEventListeners();
            }
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!unityContext || !unityContext.isLoaded) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1; // -1 to 1

        // Send mouse position to Unity
        unityContext.send("GameController", "SetMousePosition", x, y);
    };

    const handleMouseDown = () => {
        if (!unityContext || !unityContext.isLoaded) return;
        unityContext.send("GameController", "SetMouseDown", true);
    };

    const handleMouseUp = () => {
        if (!unityContext || !unityContext.isLoaded) return;
        unityContext.send("GameController", "SetMouseDown", false);
    };

    // Ha még nem kliens oldalon vagyunk, mutassunk egy placeholder-t
    if (!isClient) {
        return (
            <div className="unity-road-game-container">
                <div className="unity-loading">
                    <div className="loading-content">
                        <h3>🎮 Unity Játék Inicializálása...</h3>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '0%' }}></div>
                        </div>
                        <p>0%</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="unity-road-game-container">
            {isLoading ? (
                <div className="unity-loading">
                    <div className="loading-content">
                        <h3>🎮 Unity Játék Betöltése...</h3>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progress * 100}%` }}
                            ></div>
                        </div>
                        <p>{Math.round(progress * 100)}%</p>
                    </div>
                </div>
            ) : Unity && unityContext ? (
                <div
                    className="unity-game-view"
                    onMouseMove={handleMouseMove}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <Unity
                        unityContext={unityContext}
                        style={{
                            width: '100%',
                            height: '500px',
                            border: 'none',
                            borderRadius: '15px'
                        }}
                    />
                </div>
            ) : (
                <div className="unity-loading">
                    <div className="loading-content">
                        <h3>❌ Unity Játék Betöltési Hiba</h3>
                        <p>A Unity játék nem tölthető be. Kérjük, próbáld újra!</p>
                    </div>
                </div>
            )}

            <div className="game-instructions">
                <p>🎮 Húzd az egeret az autó mozgatásához!</p>
                <p>📋 Aktuális: {billboardData[currentBillboard]?.title}</p>
                <p>🏆 {billboardData[currentBillboard]?.year} - {billboardData[currentBillboard]?.description}</p>
            </div>
        </div>
    );
};

export default UnityRoadGame;
