import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import Stats from "three/examples/jsm/libs/stats.module";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

const CarModel = () => {
  const containerRef = useRef();

  useEffect(() => {
    let camera, scene, renderer, controls, stats;
    const wheels = [];
    let grid;
    let clock;
    let carLights;
    let carModel;

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
      controls.maxDistance = 12;
      controls.maxPolarAngle = THREE.MathUtils.degToRad(90);
      controls.target.set(0, 0.5, 0);
      controls.update();

      //    Add an event listener to log camera details on change
      controls.addEventListener("change", () => {
        console.log("Camera Position:", camera.position);
        console.log("Camera Rotation:", camera.rotation);
        console.log("Controls Target:", controls.target);
      });
      // Set up the scene
      scene = new THREE.Scene();

      const gridSize = 14; // Increase the size
      const gridDivisions = 20; // Increase the number of divisions
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

          // Set a timeout for animateGridPositionBeforeTransition
          setTimeout(() => {
            animateGridPositionBeforeTransition();
          }, 1000); // Adjust the timeout duration as needed
        },
        undefined,
        (error) => {
          console.error("Error loading the car model:", error);
        }
      );

      // Add a red plane under the car
      const ground = new THREE.Mesh(
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

      // animateGridPositionBeforeTransition();
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
            const textGeometry = new TextGeometry("FULL STACK DEVELOPER", {
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
          setTimeout(() => {
            animateGridPositionBeforeFourthTransition();
          }, 2000); // 4-second delay for the camera transition
        }
      };

      performTransition();
    };

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

      const duration = 0.5; // Transition duration in seconds for a smoother effect
      const startPosition = camera.position.clone();
      const startRotation = camera.rotation.clone();
      const elapsedTime = { value: 0 };

      // Sine ease-in-out function
      const easeInOutSine = (t) => {
        return (1 - Math.cos(t * Math.PI)) / 2; // Sine ease-in-out
      };

      const performTransition = () => {
        const delta = clock.getDelta();
        elapsedTime.value += delta;

        // Calculate eased progress using the sine easing function
        const progress = Math.min(elapsedTime.value / duration, 1);
        const easedT = easeInOutSine(progress); // Using sine easing function

        // Interpolate camera position and rotation with eased progress
        interpolateCameraThirdPositionRotation(
          startPosition,
          sixthPosition,
          startRotation,
          sixthRotation,
          easedT
        );

        // If transition is still in progress, continue updating
        if (progress < 1) {
          requestAnimationFrame(performTransition);
        } else {
          // Optionally, re-enable controls or trigger other actions after the transition
          controls.enabled = true; // Re-enable controls after transition completes
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

      // console.log(
      // `Interpolated Quaternion: ${interpolatedQuaternion.toArray()}`
      console.log("Camera Position:", camera.position);
      console.log("Camera Rotation:", camera.rotation);
      console.log("Controls Target:", controls.target);
      // );
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
