import React, { useState, useEffect, useRef } from 'react';
import {
    Engine,
    Scene,
    Vector3,
    HemisphericLight,
    DirectionalLight,
    MeshBuilder,
    StandardMaterial,
    Color3,
    ArcRotateCamera,
    Mesh,
    Animation,
    EasingFunction,
    CircleEase,
    Texture,
    DynamicTexture,
    Matrix,
    Quaternion
} from '@babylonjs/core';

interface BillboardData {
    year: string;
    title: string;
    description: string;
    position: Vector3;
}

const billboardData: BillboardData[] = [
    {
        year: '2015',
        title: 'Mechatronikai Mérnök',
        description: 'BME - Gépészmérnöki Kar',
        position: new Vector3(-8, 2, -20)
    },
    {
        year: '2017',
        title: 'Mérnökinformatikus',
        description: 'BME - Villamosmérnöki és Informatikai Kar',
        position: new Vector3(8, 2, -40)
    },
    {
        year: '2019',
        title: 'Matematika Tanár',
        description: 'ELTE - Természettudományi Kar',
        position: new Vector3(-6, 2, -60)
    },
    {
        year: '2021',
        title: 'Sportoktató',
        description: 'Testnevelési és Sporttudományi Kar',
        position: new Vector3(10, 2, -80)
    },
    {
        year: '2023',
        title: 'MIHASZNA Matek',
        description: 'Saját matek tanítási vállalkozás',
        position: new Vector3(-4, 2, -100)
    }
];

const UnrealRoadGame: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentBillboard, setCurrentBillboard] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const sceneRef = useRef<Scene | null>(null);
    const carRef = useRef<Mesh | null>(null);
    const billboardsRef = useRef<Mesh[]>([]);

    useEffect(() => {
        setIsClient(true);

        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const engine = new Engine(canvas, true);

        const createScene = () => {
            const scene = new Scene(engine);
            sceneRef.current = scene;

            // Camera setup - Unreal Engine style
            const camera = new ArcRotateCamera(
                "camera",
                0,
                Math.PI / 4,
                40,
                new Vector3(0, 8, 0),
                scene
            );
            camera.attachControl(canvas, true);
            camera.lowerRadiusLimit = 30;
            camera.upperRadiusLimit = 60;
            camera.wheelDeltaPercentage = 0.01;
            camera.lowerAlphaLimit = -Math.PI / 4;
            camera.upperAlphaLimit = Math.PI / 4;

            // Lighting - Unreal Engine style
            const hemisphericLight = new HemisphericLight(
                "hemisphericLight",
                new Vector3(0, 1, 0),
                scene
            );
            hemisphericLight.intensity = 0.3;
            hemisphericLight.groundColor = new Color3(0.1, 0.1, 0.2);

            const directionalLight = new DirectionalLight(
                "directionalLight",
                new Vector3(-1, -2, -1),
                scene
            );
            directionalLight.intensity = 0.8;
            directionalLight.position = new Vector3(20, 40, 20);

            // Road - Unreal Engine style
            const road = MeshBuilder.CreateGround(
                "road",
                { width: 20, height: 200 },
                scene
            );
            road.position = new Vector3(0, 0, -50);

            const roadMaterial = new StandardMaterial("roadMaterial", scene);
            roadMaterial.diffuseColor = new Color3(0.2, 0.2, 0.2);
            roadMaterial.specularColor = new Color3(0.1, 0.1, 0.1);
            road.material = roadMaterial;

            // Road lines
            for (let i = 0; i < 20; i++) {
                const line = MeshBuilder.CreateBox(
                    `line${i}`,
                    { width: 0.5, height: 0.1, depth: 8 },
                    scene
                );
                line.position = new Vector3(0, 0.06, -10 - i * 10);

                const lineMaterial = new StandardMaterial(`lineMaterial${i}`, scene);
                lineMaterial.diffuseColor = new Color3(1, 1, 1);
                lineMaterial.emissiveColor = new Color3(0.2, 0.2, 0.2);
                line.material = lineMaterial;
            }

            // Car - Unreal Engine style
            const car = MeshBuilder.CreateBox(
                "car",
                { width: 2, height: 1, depth: 3 },
                scene
            );
            car.position = new Vector3(0, 1, 10);
            carRef.current = car;

            const carMaterial = new StandardMaterial("carMaterial", scene);
            carMaterial.diffuseColor = new Color3(1, 0, 0);
            carMaterial.specularColor = new Color3(0.5, 0.5, 0.5);
            car.material = carMaterial;

            // Car bounce animation
            const carBounceAnimation = new Animation(
                "carBounce",
                "position.y",
                30,
                Animation.ANIMATIONTYPE_FLOAT,
                Animation.ANIMATIONLOOPMODE_CYCLE
            );

            const keyFrames = [];
            keyFrames.push({
                frame: 0,
                value: 1
            });
            keyFrames.push({
                frame: 15,
                value: 1.2
            });
            keyFrames.push({
                frame: 30,
                value: 1
            });

            carBounceAnimation.setKeys(keyFrames);
            car.animations.push(carBounceAnimation);
            scene.beginAnimation(car, 0, 30, true);

            // Billboards - Egyszerű billboardok
            billboardData.forEach((data, index) => {
                const billboard = MeshBuilder.CreatePlane(
                    `billboard${index}`,
                    { width: 6, height: 4 },
                    scene
                );
                billboard.position = data.position;
                billboard.rotation.y = Math.PI / 2;
                billboardsRef.current.push(billboard);

                const billboardMaterial = new StandardMaterial(`billboardMaterial${index}`, scene);
                billboardMaterial.diffuseColor = new Color3(0.2, 0.8, 0.2);
                billboardMaterial.emissiveColor = new Color3(0.1, 0.3, 0.1);
                billboard.material = billboardMaterial;
            });

            // Mouse controls - Egyszerű autó irányítás
            canvas.addEventListener('mousemove', (e) => {
                if (!carRef.current) return;

                const rect = canvas.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;

                // Move car
                carRef.current.position.x = x * 8;
            });

            return scene;
        };

        const scene = createScene();

        // Animation loop - Autó automatikus mozgása
        engine.runRenderLoop(() => {
            if (carRef.current) {
                // Autó automatikus előre mozgása
                carRef.current.position.z -= 0.1;

                // Ha túl messze van, visszaállítjuk
                if (carRef.current.position.z < -120) {
                    carRef.current.position.z = 10;
                }
            }
            scene.render();
        });

        // Játék betöltve - eltávolítjuk a loading képernyőt
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        const handleResize = () => {
            engine.resize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            engine.dispose();
        };
    }, []);

    if (!isClient) {
        return (
            <div className="unreal-road-game-container">
                <div className="unreal-loading">
                    <div className="loading-content">
                        <h3>🎮 Unreal Engine Játék Inicializálása...</h3>
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
        <div className="unreal-road-game-container">
            {isLoading ? (
                <div className="unreal-loading">
                    <div className="loading-content">
                        <h3>🎮 Unreal Engine Játék Betöltése...</h3>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '100%' }}></div>
                        </div>
                        <p>100%</p>
                    </div>
                </div>
            ) : (
                <canvas
                    ref={canvasRef}
                    style={{
                        width: '100%',
                        height: '500px',
                        border: 'none',
                        borderRadius: '15px',
                        cursor: 'grab'
                    }}
                />
            )}

            <div className="game-instructions">
                <p>🎮 Mozgasd az egeret az autó irányításához!</p>
                <p>📋 Aktuális: {billboardData[currentBillboard]?.title}</p>
                <p>🏆 {billboardData[currentBillboard]?.year} - {billboardData[currentBillboard]?.description}</p>
                <p>🚗 Az autó automatikusan halad előre!</p>
            </div>
        </div>
    );
};

export default UnrealRoadGame;
