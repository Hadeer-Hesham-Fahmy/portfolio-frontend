import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import Stats from "three/examples/jsm/libs/stats.module";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { gsap } from "gsap";

const CarModel = () => {
  const containerRef = useRef();

  useEffect(() => {
    let camera, scene, renderer, controls, stats, gridDivisions, gridSize;
    const wheels = [];
    let grid;
    let ground;
    let clock;
    let carLights;
    let carModel;
    let sprite;
    let textSprite;
    let newTextSprite;
    let lastTextSprite;
    let bookNameSprite;
    let canvas;

    let firstPosition = {
      x: 0.011360530913838223,
      y: 6.1532364230795515,
      z: 0.4638412209143542,
    };
    let firstRotation = {
      x: -1.4889309120046776,
      y: 0.0020028294149520252,
      z: 0.024405361276347067,
    };

    let secondPosition = {
      x: -3.401546822417285,
      y: 1.3735242157796548,
      z: -9.121347310840385,
    };
    let secondRotation = {
      x: -3.0461168068337847,
      y: -0.35545532410577013,
      z: -3.1082764109698418,
    };

    // Check if camera position is already saved in localStorage
    const savedCameraPosition = JSON.parse(
      localStorage.getItem("cameraPosition")
    );
    const savedCameraRotation = JSON.parse(
      localStorage.getItem("cameraRotation")
    );

    if (savedCameraPosition && savedCameraRotation) {
      secondPosition = savedCameraPosition;
      secondRotation = savedCameraRotation;
    }

    const init = () => {
      const container = containerRef.current;

      // Create WebGLRenderer with transparent background
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setAnimationLoop(animate);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.85;
      renderer.setClearColor(0x000000, 0); // Transparent background
      renderer.shadowMap.enabled = true; // Enable shadow maps
      container.appendChild(renderer.domElement);

      // Set up the camera
      camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        0.01,
        100
      );
      camera.position.set(firstPosition.x, firstPosition.y, firstPosition.z);
      camera.rotation.set(firstRotation.x, firstRotation.y, firstRotation.z);

      // Set up OrbitControls
      controls = new OrbitControls(camera, container);
      // controls.maxDistance = 12;
      controls.maxPolarAngle = THREE.MathUtils.degToRad(90);
      controls.target.set(0, 0.5, 0);
      controls.update();

      //    Add an event listener to log camera details on change
      // controls.addEventListener("change", () => {
      //   console.log("Camera Position:", camera.position);
      //   console.log("Camera Rotation:", camera.rotation);
      //   console.log("Controls Target:", controls.target);
      // });

      // Set up the scene
      scene = new THREE.Scene();

      gridSize = 14; // Increase the size
      gridDivisions = 20; // Increase the number of divisions
      grid = new THREE.GridHelper(gridSize, gridDivisions, 0xcfcbc8, 0xcfcbc8);
      grid.material.opacity = 0.1;
      grid.material.depthWrite = false;
      grid.material.transparent = true;
      scene.add(grid);

      // Add lighting to the scene
      const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft white light
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Brighter white light
      directionalLight.position.set(-5, 10, 7.5);
      directionalLight.castShadow = true; // Enable shadows
      scene.add(directionalLight);

      const detailsMaterial = new THREE.MeshStandardMaterial({
        metalness: 1.0,
        roughness: 0.5,
      });

      // Load the car model
      const loader = new GLTFLoader();
      loader.load(
        "models/gltf/ferrari.glb",
        (gltf) => {
          carModel = gltf.scene;

          // Helper function to create material with specified properties
          const createMaterial = ({
            color,
            roughness,
            metalness,
            opacity,
            transparent,
            emissive,
            emissiveIntensity,
            refractionRatio,
            clearcoatRoughness,
          }) => {
            return new THREE.MeshStandardMaterial({
              color,
              roughness,
              metalness,
              opacity,
              transparent,
              emissive,
              emissiveIntensity,
              refractionRatio,
              clearcoatRoughness,
            });
          };

          // Helper function to create and add spotlight to the scene
          const addSpotlight = (position, targetPosition) => {
            const spotlight = new THREE.SpotLight(
              0xffffff,
              0,
              800,
              Math.PI / 3,
              0.7
            );
            spotlight.position.set(...position);
            spotlight.target.position.set(...targetPosition);
            spotlight.penumbra = 1;
            spotlight.castShadow = true;
            scene.add(spotlight);
            scene.add(spotlight.target);
            return spotlight;
          };

          // Traverse through each child in the car model
          carModel.traverse((child) => {
            if (!child.isMesh) return;

            child.castShadow = true;
            child.receiveShadow = true;

            // Apply materials based on child name
            if (child.name.includes("Mesh089_11")) {
              // Car lights material
              carLights = child;
              child.material = createMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.7,
              });
            } else if (child.name.includes("Mesh089_8")) {
              // Create and add left and right spotlights
              window.leftSpotlight = addSpotlight(
                [2.7, 0.9, 0.2],
                [2.2, 2.2, 6]
              );
              window.rightSpotlight = addSpotlight(
                [0.3, 0.9, 0.2],
                [-0.2, 2.2, 6]
              );

              // More intense light on the car mesh
              child.material = createMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 1.5,
                transparent: true,
                opacity: 0.7,
              });
            } else if (
              child.name.includes("Mesh089_3") ||
              child.name.includes("Mesh089_5")
            ) {
              // Logo material
              child.material = createMaterial({
                color: 0xffffff,
                roughness: 0.7,
                metalness: 0.7,
              });
            } else if (child.name.includes("Mesh089_9")) {
              // Back part visible through the net
              child.material = createMaterial({
                color: 0xc0c0c0,
                roughness: 0.7,
                metalness: 0.7,
              });
            } else if (child.name.includes("Mesh089_7")) {
              // Front glass and upper part
              child.material = createMaterial({
                color: 0x333333,
                roughness: 0.2,
                metalness: 0.8,
                refractionRatio: 0.9,
                clearcoatRoughness: 0.1,
                transparent: true,
                opacity: 0.97,
              });
            } else if (
              child.name.includes("Mesh089_8") ||
              child.name.includes("Mesh089_11")
            ) {
              // Front lights
              child.material = createMaterial({
                color: 0xc0c0c0,
                transparent: true,
                opacity: 0.7,
              });
            } else if (
              child.name.includes("Mesh089_6") ||
              child.name.includes("Mesh089_2") ||
              child.name.includes("Mesh089_14")
            ) {
              // Back glass and mirror skeletons
              child.material = createMaterial({
                color: 0x8b0000,
                roughness: 0.4,
                metalness: 0.5,
              });
            } else if (child.name.includes("Mesh089_4")) {
              // Other car parts with metal properties
              child.material = createMaterial({
                color: 0x555555,
                metalness: 0.6,
              });
            } else {
              // Default material for all other parts
              child.material = createMaterial({
                color: 0x555555,
                roughness: 0.4,
                metalness: 0.8,
              });
            }
          });

          // Apply material to specific wheels
          const wheelsList = ["FL", "FR", "RL", "RR"];
          wheelsList.forEach((wheelName) => {
            const wheel = carModel.getObjectByName(wheelName);
            if (wheel) {
              wheel.material = detailsMaterial;
              wheels.push(wheel);
            }
          });

          // Set car model position and scale
          carModel.position.set(1.5, 0, -2.5);
          carModel.scale.set(1, 1, 1);

          // Add the car model to the scene
          scene.add(carModel);

          controls.addEventListener("change", () => {
            console.log("Car Position:", carModel.position);
            console.log("Car Rotation:", carModel.rotation);
            console.log("Controls Target:", controls.target);
          });

          // Set a timeout for animateGridPositionBeforeTransition
          setTimeout(() => {
            animateGridPositionBeforeTransition();
            // animateGridPositionBeforeSixthTransition();
          }, 1000); // Adjust the timeout duration as needed
        },
        undefined,
        (error) => {
          console.error("Error loading the car model:", error);
        }
      );

      // Add a red plane under the car
      ground = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 14), // Adjust the size of the plane as needed
        new THREE.MeshStandardMaterial({
          color: 0xff0000,
          roughness: 0.8,
          metalness: 0.1,
        }) // Red color for the ground
      );
      ground.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
      ground.position.y = -0.05; // Position the plane slightly under the car
      ground.receiveShadow = true; // The plane will receive shadows
      scene.add(ground);

      // Window resize listener
      window.addEventListener("resize", onWindowResize);

      stats = new Stats();

      // Create a clock for time-based animation
      clock = new THREE.Clock();

      // Save the second position after the animation completes
      localStorage.setItem("cameraPosition", JSON.stringify(secondPosition));
      localStorage.setItem("cameraRotation", JSON.stringify(secondRotation));
    };

    const createSpine = () => {
      const spine = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 3), // Narrow plane for the spine
        new THREE.MeshStandardMaterial({
          color: 0x4b4b4b,
          // roughness: 0.2,
          // metalness: 0.1,
        })
      );
      spine.rotation.y = Math.PI; // Rotate to be vertical
      spine.rotation.x = -10; // Rotate to be vertical
      const goundXposition = ground.position.x;
      spine.position.set(goundXposition, -0.05, 4); // Align with the edge of the ground plane
      spine.receiveShadow = true;
      scene.add(spine);
    };

    const createSmoke = () => {
      const smokeCount = 1300; // Number of smoke particles
      const positions = new Float32Array(smokeCount * 3); // 3 vertices per particle
      const velocities = new Float32Array(smokeCount * 3); // Store velocity for each particle
      const sizes = new Float32Array(smokeCount); // Store size for each particle

      // Define the starting position
      const startPosition = new THREE.Vector3(0, -1, -5);
      const minZ = -9;
      const smokeSpeed = 0.1; // Speed of smoke
      const smokeDirection = new THREE.Vector3(1, 2.2, -4).normalize(); // Direction towards the sky

      // Initialize positions, velocities, and sizes
      for (let i = 0; i < smokeCount; i++) {
        // Offset random positions by the starting position
        const x = startPosition.x + (Math.random() * 2 - 1);
        const y = startPosition.y + (Math.random() * 2 - 1);
        const z = Math.max(startPosition.z + (Math.random() * 2 - 1), minZ);

        positions.set([x, y, z], i * 3);

        // Set random velocity for each particle (vertical and slightly sideways)
        velocities.set(
          [
            (Math.random() - 0.5) * 0.3,
            Math.random() * 0.1 + 0.1,
            (Math.random() - 0.5) * 0.1,
          ],
          i * 3
        );

        // Randomize size of particles for variation
        sizes[i] = Math.random() * 0.5 + 0.5;
      }

      const smokeGeometry = new THREE.BufferGeometry();
      smokeGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      smokeGeometry.setAttribute(
        "velocity",
        new THREE.BufferAttribute(velocities, 3)
      );
      smokeGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      const smokeMaterial = new THREE.MeshBasicMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      });

      const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
      const smokeParticles = [];

      for (let i = 0; i < smokeCount; i++) {
        const particleMesh = new THREE.Mesh(cylinderGeometry, smokeMaterial);
        particleMesh.position.set(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        );
        particleMesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          0
        );
        particleMesh.scale.set(1.5, 1.5, 1.5);

        smokeParticles.push(particleMesh);
        scene.add(particleMesh);
      }

      let textLight = null;
      let backLight = null;
      let textMesh = null;
      let showText = false;
      let removedParticles = 0;

      const animateSmoke = () => {
        for (let i = 0; i < smokeCount; i++) {
          const particle = smokeParticles[i];
          if (!particle) continue;

          // Update particle position using pre-defined direction and speed
          particle.position.add(
            smokeDirection.clone().multiplyScalar(smokeSpeed)
          );

          if (!showText && particle.position.y > 1.2) {
            showText = true;
            displayText();
          }

          if (textMesh && particle.position.y > 2) {
            scene.remove(textLight, backLight, textMesh);
            textMesh = null;
            transitionCameraToFourthPosition();
            controlSpotlightIntensity(0, 0, 600); // Adjust spotlight intensity after transition
          }

          if (particle.position.y > 3) {
            scene.remove(particle);
          }
        }
        requestAnimationFrame(animateSmoke);
      };

      animateSmoke();

      const displayText = () => {
        const loader = new FontLoader();
        loader.load(
          "https://raw.githubusercontent.com/7dir/json-fonts/master/fonts/cyrillic/roboto/Roboto_Regular.json",
          (font) => {
            const textGeometry = new TextGeometry("a FULL STACK DEVELOPER", {
              font: font,
              size: 0.021,
              height: -0.01,
              curveSegments: 8,
            });
            textGeometry.center();

            const textMaterial = new THREE.MeshPhongMaterial({
              color: 0x222222,
              shininess: 70,
              specular: 0x666666,
            });

            textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(0.925, 1.635, -9.407);
            textMesh.rotation.set(0, Math.PI, 0);

            textLight = new THREE.DirectionalLight(0xffffff, 1.5);
            textLight.position.set(2, 2, 3);
            scene.add(textLight);

            backLight = new THREE.DirectionalLight(0xffffff, 0.5);
            backLight.position.set(-2, -1, -1);
            scene.add(backLight);

            scene.add(textMesh);
          }
        );
      };
    };

    // Animates the grid position before the transition
    const animateGridPositionBeforeTransition = () => {
      const duration = 3; // Duration for grid movement
      const startTime = clock.getElapsedTime();

      const updateGridPosition = () => {
        const elapsedTime = clock.getElapsedTime() - startTime;
        const timeInPeriod = elapsedTime % duration;

        // Move the grid based on elapsed time
        grid.position.z = (-timeInPeriod * 3) % 1;

        if (elapsedTime >= duration) {
          transitionCameraToSecondPosition();
          return;
        }

        // Continue updating the grid position
        requestAnimationFrame(updateGridPosition);
      };

      updateGridPosition();
    };

    // Smoothly transitions the camera position and rotation
    const transitionCameraToSecondPosition = () => {
      const secondPosition = new THREE.Vector3(
        -3.401546822417285,
        1.3735242157796548,
        -9.121347310840385
      );
      const secondRotation = new THREE.Euler(
        -3.0461168068337847,
        -0.35545532410577013,
        -3.1082764109698418
      );

      const duration = 2; // Transition duration in seconds
      const startPosition = camera.position.clone();
      const startRotation = camera.rotation.clone();
      const elapsedTime = { value: 0 };

      const performTransition = () => {
        const delta = clock.getDelta();
        elapsedTime.value += delta;

        const t = Math.min(elapsedTime.value / duration, 1); // Clamp t between 0 and 1 for smooth interpolation

        // Interpolate camera position and rotation
        interpolateCameraPositionRotation(
          startPosition,
          secondPosition,
          startRotation,
          secondRotation,
          t
        );

        // Update the grid position based on elapsed time
        grid.position.z = (elapsedTime.value * 2) % 1;

        // If transition is still in progress, continue updating
        if (t < 1) {
          requestAnimationFrame(performTransition);
          rotateWheels(0.01); // Rotate wheels during the transition
        } else {
          controlSpotlightIntensity(400, 800, 600); // Adjust spotlight intensity after transition
          flashCarLights(); // Flash car lights
          resetWheelRotation(); // Reset wheel rotation

          // Start the second animation with a 3-second delay
          setTimeout(() => {
            animateGridPositionBeforeSecondTransition();
          }, 4000); // Delay in milliseconds (4000 ms = 4 seconds)
        }
      };

      performTransition();
    };

    // Interpolates camera position and rotation smoothly
    const interpolateCameraPositionRotation = (
      startPos,
      endPos,
      startRot,
      endRot,
      t
    ) => {
      camera.position.lerpVectors(startPos, endPos, t);
      camera.rotation.set(
        THREE.MathUtils.lerp(startRot.x, endRot.x, t),
        THREE.MathUtils.lerp(startRot.y, endRot.y, t),
        THREE.MathUtils.lerp(startRot.z, endRot.z, t)
      );
    };
    // Animates the grid position before the transition
    const animateGridPositionBeforeThirdTransition = () => {
      const duration = 0.5; // Duration for grid movement
      const startTime = clock.getElapsedTime();

      const updateGridPosition = () => {
        const elapsedTime = clock.getElapsedTime() - startTime;
        const timeInPeriod = elapsedTime % duration;

        // Move the grid based on elapsed time
        grid.position.z = (-timeInPeriod * 3) % 1;

        if (elapsedTime >= duration) {
          transitionCameraToFifthPosition();

          return;
        }

        // Continue updating the grid position
        requestAnimationFrame(updateGridPosition);
      };

      updateGridPosition();
    };

    // Animates the grid position before the transition
    const animateGridPositionBeforeFourthTransition = () => {
      const initialDuration = 2; // Initial duration for grid movement
      const startTime = clock.getElapsedTime();
      let speed = 0; // Initial speed

      const updateGridPosition = () => {
        const elapsedTime = clock.getElapsedTime() - startTime;

        // Increase speed over time
        speed += 1 * elapsedTime; // Adjust this value to control the acceleration rate

        // Move the grid based on elapsed time and the increased speed
        grid.position.z = (-elapsedTime * speed) % 1;

        if (elapsedTime >= initialDuration) {
          transitionCameraToSixthPosition();
          return;
        }

        // Continue updating the grid position
        requestAnimationFrame(updateGridPosition);
      };

      updateGridPosition();
    };

    // Animates the grid position before the transition
    const animateGridPositionBeforeFifthTransition = () => {
      const initialDuration = 2; // Initial duration for grid movement
      const startTime = clock.getElapsedTime();
      let speed = 0; // Initial speed

      const updateGridPosition = () => {
        const elapsedTime = clock.getElapsedTime() - startTime;

        // Increase speed over time
        speed += 1 * elapsedTime; // Adjust this value to control the acceleration rate

        // Move the grid based on elapsed time and the increased speed
        grid.position.z = (-elapsedTime * speed) % 1;

        if (elapsedTime >= initialDuration) {
          transitionCameraToSixthPosition();
          return;
        }

        // Continue updating the grid position
        requestAnimationFrame(updateGridPosition);
      };

      updateGridPosition();
    };

    const animateGridPositionBeforeSixthTransition = () => {
      const initialDuration = 2; // Initial duration for grid movement
      const startTime = clock.getElapsedTime();
      let speed = 0; // Initial speed

      const updateGridPosition = () => {
        const elapsedTime = clock.getElapsedTime() - startTime;

        // Increase speed over time
        speed += 1 * elapsedTime; // Adjust this value to control the acceleration rate

        // Move the grid based on elapsed time and the increased speed
        grid.position.z = (-elapsedTime * speed) % 1;

        if (elapsedTime >= initialDuration) {
          transitionCameraToSeventhPosition();
          return;
        }

        // Continue updating the grid position
        requestAnimationFrame(updateGridPosition);
      };

      updateGridPosition();
    };

    const animateGridPositionBeforeSeventhTransition = () => {
      const initialDuration = 2; // Initial duration for grid movement
      const startTime = clock.getElapsedTime();
      let speed = 0; // Initial speed

      const updateGridPosition = () => {
        const elapsedTime = clock.getElapsedTime() - startTime;

        // Increase speed over time
        speed += 1 * elapsedTime; // Adjust this value to control the acceleration rate

        if (elapsedTime >= initialDuration) {
          transitionCarToNinethPosition();
          return;
        }

        // Continue updating the grid position
        requestAnimationFrame(updateGridPosition);
      };

      updateGridPosition();
    };

    // Smoothly transitions the camera position and rotation
    const transitionCameraToThirdPosition = () => {
      const thirdPosition = new THREE.Vector3(
        0.9585598021476531,
        1.659640384030547,
        -9.657584552622703
      );
      const thirdRotation = new THREE.Euler(
        -3.0220891887340238,
        0.09822955835134238,
        3.1298171826938366
      );

      const duration = 0.33; // Transition duration in seconds
      const startPosition = camera.position.clone();
      const startRotation = camera.rotation.clone();
      const elapsedTime = { value: 0 };

      const performTransition = () => {
        const delta = clock.getDelta();
        elapsedTime.value += delta;

        const t = Math.min(elapsedTime.value / duration, 1); // Clamp t between 0 and 1 for smooth interpolation

        // Interpolate camera position and rotation
        interpolateCameraThirdPositionRotation(
          startPosition,
          thirdPosition,
          startRotation,
          thirdRotation,
          t
        );

        // Update the grid position based on elapsed time
        grid.position.z = (elapsedTime.value * 2) % 1;

        // If transition is still in progress, continue updating
        if (t < 1) {
          requestAnimationFrame(performTransition);
        } else {
          createSmoke();
        }
      };

      performTransition();
    };

    // Smoothly transitions the camera position and rotation
    const transitionCameraToFourthPosition = () => {
      const fourthPosition = new THREE.Vector3(
        -0.06995848505213946,
        0.5000000000000004,
        7.184502671528425
      );
      const fourthRotation = new THREE.Euler(
        -6.18121017074641e-17,
        -0.009737107394319799,
        -6.018615619467827e-19
      );

      const duration = 0.33; // Transition duration in seconds
      const startPosition = camera.position.clone();
      const startRotation = camera.rotation.clone();
      const elapsedTime = { value: 0 };

      const performTransition = () => {
        const delta = clock.getDelta();
        elapsedTime.value += delta;

        const t = Math.min(elapsedTime.value / duration, 1); // Clamp t between 0 and 1 for smooth interpolation

        // Interpolate camera position and rotation
        interpolateCameraThirdPositionRotation(
          startPosition,
          fourthPosition,
          startRotation,
          fourthRotation,
          t
        );

        // If transition is still in progress, continue updating
        if (t < 1) {
          requestAnimationFrame(performTransition);
        } else {
          setTimeout(() => {
            animateGridPositionBeforeThirdTransition();
          }, 3000); // 3-second delay
        }
      };

      performTransition();
    };

    // // Create a raycaster and a vector for mouse position
    // const raycaster = new THREE.Raycaster();
    // const mouse = new THREE.Vector2();

    // // Add event listener for mouse click
    // window.addEventListener("click", (event) => {
    //   // Convert mouse position to normalized device coordinates (-1 to +1) for both components
    //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //   // Update the raycaster with the camera and mouse position
    //   raycaster.setFromCamera(mouse, camera);

    //   // Calculate objects intersecting the picking ray
    //   const intersects = raycaster.intersectObject(ground);

    //   // Log the intersections for debugging
    //   console.log(intersects); // Check the contents of intersects

    //   if (intersects.length > 0) {
    //     // Get the first intersected object
    //     const intersectionPoint = intersects[0].point;
    //     console.log("Clicked Position:", intersectionPoint);

    //     // Optionally, create a visual marker at the clicked position
    //     const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    //     const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    //     const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    //     marker.position.copy(intersectionPoint);
    //     scene.add(marker);
    //   } else {
    //     console.log("No intersection with the ground plane");
    //   }
    // });

    const createTextSprite = (texts, options = {}) => {
      canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const fontSize = options.fontSize || 45; // Set a default font size
      const lineHeight = options.lineHeight || 72; // Set a default font size
      const color = options.color || "#000000"; // Default color if not provided
      const padding = options.padding || 20; // Default to 0 if padding not provided

      // Adjust canvas size to fit text length and number of lines
      canvas.width = 800 + padding * 2; // Adjust width based on text length
      canvas.height = lineHeight * texts.length + 100 + padding * 2; // Adjust height based on the number of lines

      // Set the font style
      context.font = `bold ${fontSize}px Roboto`;
      context.fillStyle = color;

      // Draw each line of text with padding applied
      texts.forEach((text, index) => {
        context.fillText(text, padding, (index + 1) * lineHeight + padding);
      });

      // Create texture from the canvas
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true; // Update the texture for rendering

      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      sprite = new THREE.Sprite(spriteMaterial);

      // Set the sprite size to scale appropriately
      sprite.scale.set(canvas.width / 400, canvas.height / 400, 1); // Adjust scale to fit in 3D scene

      // Position the sprite slightly above the ground
      sprite.position.set(-0.25, 0.15, 3); // Adjust Y value to prevent clipping into the ground

      return sprite;
    };

    const transitionCameraToFifthPosition = () => {
      const fifthPosition = new THREE.Vector3(
        -0.1409001448897513,
        0.8511307574041045,
        1.578605209814845
      );
      const fifthRotation = new THREE.Euler(
        -0.21886790328396646,
        -0.08690733270800344,
        -0.019304163067079882
      );

      const duration = 0.5; // Transition duration in seconds
      const startPosition = camera.position.clone();
      const startRotation = camera.rotation.clone();
      const elapsedTime = { value: 0 };

      // Cubic ease-in function
      const easeInCubic = (t) => t * t * t;

      const performTransition = () => {
        const delta = clock.getDelta();
        elapsedTime.value += delta;

        // Calculate eased progress using the cubic easing function
        const progress = Math.min(elapsedTime.value / duration, 1);
        const easedT = easeInCubic(progress);

        // Interpolate camera position and rotation with eased progress
        interpolateCameraThirdPositionRotation(
          startPosition,
          fifthPosition,
          startRotation,
          fifthRotation,
          easedT
        );

        // If transition is still in progress, continue updating
        if (progress < 1) {
          requestAnimationFrame(performTransition);
        } else {
          // After the transition is complete, create and add the text sprite
          textSprite = createTextSprite([
            "FAST LEARNER",
            "FAST THINKER",
            "FAST PROBLEM-SOLVER",
            "FAST EXECUTER",
          ]);
          // textSprite.position.z = 3;
          newTextSprite = createTextSprite(
            [
              "Over 50 Certifications Earned",
              "2+ Years Experience",
              "10+ Completed Projects",
              "Most Improved Employee Badge Winner",
            ],
            {
              fontSize: 30,
              lineHeight: 52, // Set the line height for spacing between lines
            }
          );
          // newTextSprite.position.z = 4;
          lastTextSprite = createTextSprite(["A", "GAME", "CHANGER"], {
            fontSize: 70,
          });
          // lastTextSprite.position.z = 5;

          scene.add(textSprite, newTextSprite, lastTextSprite); // Add the sprite to the scene
          setTimeout(() => {
            animateGridPositionBeforeFourthTransition();
          }, 2000); // 4-second delay for the camera transition
        }
      };

      performTransition();
    };
    let transitionCounter = 0;

    const transitionCameraToSixthPosition = () => {
      const sixthPosition = new THREE.Vector3(
        -0.12265624605997878,
        1.3553678008123193,
        1.3742057483199792
      );
      const sixthRotation = new THREE.Euler(
        -0.556760061158256,
        -0.07563136355462739,
        -0.04699688197370023
      );

      const duration = 0.33; // Transition duration in seconds for a smoother effect
      const startPosition = camera.position.clone();
      const startRotation = camera.rotation.clone();
      const startZPosition = sprite.position.z;
      const targetZPosition = -0.45;
      const elapsedTime = { value: 0 };

      // Sine ease-in-out function
      const easeInOutSine = (t) => (1 - Math.cos(t * Math.PI)) / 2;

      // Ease-out quadratic function for a gradual slow-down effect
      const easeOutQuad = (t) => t * (2 - t);

      const performTransition = () => {
        const delta = clock.getDelta();
        elapsedTime.value += delta;

        // Calculate eased progress using the sine easing function
        const progress = Math.min(elapsedTime.value / duration, 1);
        const easedT = easeInOutSine(progress);
        const easedOutT = easeOutQuad(progress);

        // Interpolate camera position and rotation with eased progress
        interpolateCameraThirdPositionRotation(
          startPosition,
          sixthPosition,
          startRotation,
          sixthRotation,
          easedT
        );

        // Interpolating z position of the sprite based on current transition
        if (transitionCounter === 0) {
          // Move initial textSprite to target z position
          textSprite.position.z = THREE.MathUtils.lerp(
            startZPosition,
            targetZPosition,
            easedOutT
          );
        } else if (transitionCounter === 1) {
          // Move newTextSprite to target position and old textSprite away
          textSprite.position.z = THREE.MathUtils.lerp(
            startZPosition,
            -3, // Move the old text sprite further back
            easedOutT
          );
          newTextSprite.position.z = THREE.MathUtils.lerp(
            startZPosition,
            targetZPosition, // Bring newTextSprite to the main position
            easedOutT
          );
        } else if (transitionCounter === 2) {
          // Move the previous textSprites further back and bring in the lastTextSprite
          textSprite.position.z = -5; // Move first text sprite further away
          newTextSprite.position.z = THREE.MathUtils.lerp(
            startZPosition,
            -3, // Move new text sprite further back
            easedOutT
          );
          lastTextSprite.position.z = THREE.MathUtils.lerp(
            startZPosition,
            targetZPosition, // Bring lastTextSprite to the main position
            easedOutT
          );
        }

        // If transition is still in progress, continue updating
        if (progress < 1) {
          requestAnimationFrame(performTransition);
        } else {
          transitionCounter++;
          if (transitionCounter === 3) {
            setTimeout(() => {
              scene.remove(textSprite, newTextSprite); // Add the sprite to the scene

              animateGridPositionBeforeSixthTransition();

              return; // Exit the function if the limit is reached
            }, 2000);
          } else {
            setTimeout(() => {
              animateGridPositionBeforeFifthTransition();
            }, 2000);
          }
        }
      };

      performTransition();
    };

    const updateGroundDimensions = (newWidth, newHeight) => {
      // Dispose of the old geometry
      ground.geometry.dispose();

      // Create a new geometry with the updated dimensions
      ground.geometry = new THREE.PlaneGeometry(newWidth, newHeight);
    };

    const updateGridDimensions = (newSize, newDivisions) => {
      // Remove the existing grid from the scene
      scene.remove(grid);

      // Dispose of the old grid material
      grid.geometry.dispose();
      grid.material.dispose();

      // Create a new grid helper with updated dimensions
      grid = new THREE.GridHelper(newSize, newDivisions, 0xcfcbc8, 0xcfcbc8);
      grid.material.opacity = 0.1;
      grid.material.depthWrite = false;
      grid.material.transparent = true;

      // Add the new grid to the scene
      scene.add(grid);
    };

    const transitionCameraToSeventhPosition = () => {
      createSpine();
      const seventhPosition = new THREE.Vector3(
        5.50008718517777052084,
        88.43225805251171,
        -3.000011467962763065247
      );
      const seventhRotation = new THREE.Euler(
        -1.5707964572130506,
        -9.915039110854299e-7,
        -1.701581204220701
      );

      const duration = 3; // Duration for each transition in seconds

      let elapsedTimeTransition = { value: 0 }; // Separate elapsed time for performTransition
      let elapsedTimeCarModel = { value: 0 }; // Separate elapsed time for performCarModelTransition

      const easeInOutSine = (t) => (1 - Math.cos(t * Math.PI)) / 2;

      const performTransition = () => {
        const delta = clock.getDelta();
        elapsedTimeTransition.value += delta;

        const progress = Math.min(elapsedTimeTransition.value / duration, 1);
        const easedT = easeInOutSine(progress);
        const startPosition = camera.position.clone();
        const startRotation = camera.rotation.clone();
        // Bounce and wobble effects
        const bounceY = Math.sin(progress * 10 * Math.PI) * 2;
        const wobbleX = Math.sin(progress * 5 * Math.PI) * 0.05;

        const funnyPosition = new THREE.Vector3(
          THREE.MathUtils.lerp(
            startPosition.x,
            seventhPosition.x + wobbleX,
            easedT
          ),
          THREE.MathUtils.lerp(
            startPosition.y,
            seventhPosition.y + bounceY,
            easedT
          ),
          seventhPosition.z
        );

        interpolateCameraThirdPositionRotation(
          startPosition,
          funnyPosition,
          startRotation,
          seventhRotation,
          easedT
        );

        if (ground && grid) {
          const blackColor = new THREE.Color(0x222222);
          const greyColor = new THREE.Color(0x565656);
          const slowProgress = Math.min((progress * 2) / 16, 1);

          ground.material.color.lerp(blackColor, slowProgress);
          ground.material.metalness = 0;
          ground.material.roughness = 0;
          grid.material.color.lerp(greyColor, slowProgress);
          updateGroundDimensions(16, 7);
          updateGridDimensions(7, 3);
        }

        if (progress < 1) {
          requestAnimationFrame(performTransition);
        } else {
          performCarModelTransition(); // Begin car model transition after completing performTransition

          bookNameSprite = createTextSprite(["  A", " GAME", "CHANGER"], {
            fontSize: 550,
            color: "#565656",
            lineHeight: 800,
            padding: 2500,
            fontFamily: "Arial Black",
            gradient: {
              start: "#ff7e5f", // Start color of the gradient
              end: "#ffffff", // End color of the gradient
            },
            shadow: {
              color: "#000000", // Shadow color
              blur: 20, // Shadow blur
              offsetX: 5, // Horizontal shadow offset
              offsetY: 5, // Vertical shadow offset
            },
          });

          // Set scale and position
          const scaleX = canvas.width / 400;
          const scaleY = canvas.height / 400;
          bookNameSprite.scale.set(scaleX, scaleY, 1);
          bookNameSprite.position.set(2, 0, -2.1);
          bookNameSprite.alpha = 0; // Start fully transparent

          // Add the sprite to the scene
          scene.add(bookNameSprite);

          // Animate the sprite to fade in and slightly move forward after a short delay
          gsap.to(bookNameSprite.position, {
            duration: 1,
            z: -2.05, // Move slightly closer for effect
            ease: "power2.out",
            delay: 0.5, // Optional: Delay the animation start
          });

          gsap.to(bookNameSprite, {
            duration: 1,
            alpha: 1, // Fade in
            ease: "power2.out",
            delay: 0.5, // Optional: Match delay with position animation
          });
        }
      };

      const performCarModelTransition = () => {
        const eighthPosition = new THREE.Vector3(
          -7.5,
          4,
          -1.000011467962763065247
        );
        const eighthRotation = new THREE.Euler(0, 0.2, -0.2);

        const startCarPosition = carModel.position.clone();
        const startCarRotation = carModel.rotation.clone();

        const delta = clock.getDelta();
        elapsedTimeCarModel.value += delta;

        const progress = Math.min(elapsedTimeCarModel.value / duration, 1);
        const easedT = easeInOutSine(progress);

        const bounceY = Math.sin(easedT * Math.PI * 4) * 0.5;
        const wobbleX = Math.sin(easedT * Math.PI * 3) * 0.02;

        const funnyPosition = new THREE.Vector3(
          THREE.MathUtils.lerp(
            startCarPosition.x,
            eighthPosition.x + wobbleX,
            easedT
          ),
          THREE.MathUtils.lerp(
            startCarPosition.y,
            eighthPosition.y + bounceY,
            easedT
          ),
          eighthPosition.z
        );

        interpolateCarPositionRotation(
          startCarPosition,
          funnyPosition,
          startCarRotation,
          eighthRotation,
          easedT
        );

        if (progress < 1) {
          requestAnimationFrame(performCarModelTransition);
        } else {
          console.log("Car model transition complete.");

          animateGridPositionBeforeSeventhTransition();
        }
      };

      performTransition();
    };

    const transitionCarToNinethPosition = () => {
      const ninethPosition = new THREE.Vector3(
        -3.4856306573377625,
        28.042793437870927,
        -25.411137040453539
      );
      const ninethRotation = new THREE.Euler(
        2.832009196432874e-17,
        -0.2000000000000002,
        -1.4999999999999999
      );

      const targetScale = new THREE.Vector3(8.6, 8.6, 8.6); // Define your target scale
      const duration = 3; // Duration for each transition in seconds

      let elapsedTimeTransition = { value: 0 }; // Separate elapsed time for performTransition

      const easeInOutSine = (t) => (1 - Math.cos(t * Math.PI)) / 2;

      const performTransition = () => {
        const delta = clock.getDelta();
        elapsedTimeTransition.value += delta;

        const progress = Math.min(elapsedTimeTransition.value / duration, 1);
        const easedT = easeInOutSine(progress);

        const startPosition = carModel.position.clone();
        const startRotation = carModel.rotation.clone();
        const startScale = carModel.scale.clone(); // Get the current scale

        // Interpolate position and rotation
        interpolateCarPositionRotation(
          startPosition,
          ninethPosition,
          startRotation,
          ninethRotation,
          easedT
        );

        // Interpolate scale
        carModel.scale.x = THREE.MathUtils.lerp(
          startScale.x,
          targetScale.x,
          easedT
        );
        carModel.scale.y = THREE.MathUtils.lerp(
          startScale.y,
          targetScale.y,
          easedT
        );
        carModel.scale.z = THREE.MathUtils.lerp(
          startScale.z,
          targetScale.z,
          easedT
        );

        if (progress < 1) {
          requestAnimationFrame(performTransition);
        } else {
          // You can add any additional logic here after the transition completes
        }
      };

      performTransition();
    };

    // Animates the grid position before the transition
    const animateGridPositionBeforeSecondTransition = () => {
      const duration = 0.5; // Duration for grid movement
      const startTime = clock.getElapsedTime();

      const updateGridPosition = () => {
        const elapsedTime = clock.getElapsedTime() - startTime;
        const timeInPeriod = elapsedTime % duration;

        // Move the grid based on elapsed time
        grid.position.z = (-timeInPeriod * 3) % 1;

        if (elapsedTime >= duration) {
          transitionCameraToThirdPosition();
          return;
        }

        // Continue updating the grid position
        requestAnimationFrame(updateGridPosition);
      };

      updateGridPosition();
    };

    const interpolateCarPositionRotation = (
      startPos,
      endPos,
      startRot,
      endRot,
      t
    ) => {
      // Interpolate camera position
      carModel.position.lerpVectors(startPos, endPos, t);

      // Create quaternions from the start and end Euler rotations
      const startQuaternion = new THREE.Quaternion().setFromEuler(startRot);
      const endQuaternion = new THREE.Quaternion().setFromEuler(endRot);

      // Interpolate the quaternions using spherical linear interpolation (slerp)
      const interpolatedQuaternion = new THREE.Quaternion().slerpQuaternions(
        startQuaternion,
        endQuaternion,
        t
      );

      // Apply the interpolated quaternion to the camera
      carModel.quaternion.copy(interpolatedQuaternion);
    };

    // Interpolates camera position and rotation smoothly using quaternions
    const interpolateCameraThirdPositionRotation = (
      startPos,
      endPos,
      startRot,
      endRot,
      t
    ) => {
      // Interpolate camera position
      camera.position.lerpVectors(startPos, endPos, t);

      // Create quaternions from the start and end Euler rotations
      const startQuaternion = new THREE.Quaternion().setFromEuler(startRot);
      const endQuaternion = new THREE.Quaternion().setFromEuler(endRot);

      // Interpolate the quaternions using spherical linear interpolation (slerp)
      const interpolatedQuaternion = new THREE.Quaternion().slerpQuaternions(
        startQuaternion,
        endQuaternion,
        t
      );

      // Apply the interpolated quaternion to the camera
      camera.quaternion.copy(interpolatedQuaternion);
    };

    // Rotates wheels during the transition
    const rotateWheels = (rotationSpeed) => {
      wheels.forEach((wheel) => {
        wheel.rotation.z += rotationSpeed;
      });
    };

    // Adjusts the spotlight intensity over a given duration
    const controlSpotlightIntensity = (
      halfIntensity,
      fullIntensity,
      totalDuration
    ) => {
      if (window.leftSpotlight && window.rightSpotlight) {
        window.leftSpotlight.intensity = halfIntensity;
        window.rightSpotlight.intensity = halfIntensity;

        setTimeout(() => {
          window.leftSpotlight.intensity = fullIntensity;
          window.rightSpotlight.intensity = fullIntensity;
        }, totalDuration / 2);
      }
    };

    // Resets the rotation of wheels to their normal position
    const resetWheelRotation = () => {
      wheels.forEach((wheel) => {
        wheel.rotation.z = 0; // Reset rotation to the initial position
      });
    };

    const flashCarLights = () => {
      if (!carLights) return; // If the lights are not loaded yet, return

      const flashDuration = 0.1; // Duration of each flash in seconds (quicker flashes)
      const totalDuration = 0.6; // Total duration of flashing in seconds
      const flashIntervalTime = flashDuration * 1000; // Flash interval time in milliseconds

      let flashing = true;
      let elapsedTime = 0;

      const flashInterval = setInterval(() => {
        if (flashing) {
          // Brighten the lights
          carLights.material.opacity = 0.9; // Brighter lights
        } else {
          // Dim the lights
          carLights.material.opacity = 0.3; // Dimmer lights
        }
        flashing = !flashing; // Toggle the flashing state
      }, flashIntervalTime);

      // Stop the flashing after the total duration
      setTimeout(() => {
        clearInterval(flashInterval); // Stop flashing
        carLights.material.opacity = 0.7; // Ensure lights are fully on after the flash
      }, totalDuration * 1000);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      // controls.update();
      controls.enabled = false;
      renderer.render(scene, camera);
      stats.update();
    };

    // Adding the Math.lerp method (if not already available in your environment)
    Math.lerp = (start, end, t) => {
      return start + (end - start) * t;
    };

    init();

    return () => {
      containerRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="centered-container" />;
};

export default CarModel;
