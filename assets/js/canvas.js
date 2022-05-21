function init() {
    // 创建场景
    let scene = new THREE.Scene();
    scene.updateMatrixWorld(true);
    // 创建沙盘群组
    let sandboxes = new THREE.Object3D();
    scene.add(sandboxes)
    // 设置摄像机
    let aspectRatio = window.innerWidth / window.innerHeight; // 确定当前窗口长宽比以用于摄影机设置
    let camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 50); // 0.1 和 2000 是最近和最远距离
    // 创建渲染器
    let renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    // 设置输出canvas画面的大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // 设置渲染物体阴影
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; // options are THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap

    // 加载loaderManager
    const manager = new THREE.LoadingManager();
    manager.onLoad = function () {
        document.getElementById("start-button").style.visibility = "visible";
        document.getElementById("loading-animation").style.visibility = "hidden";
    };
    manager.onError = function () {
        document.getElementById("start-button").style.visibility = "visible";
        document.getElementById("start-button").textContent = "有错误 仍然开始";
        document.getElementById("loading-animation").style.visibility = "hidden";
    };

    // 加载两个球
    // 加载loader
    let loader = new THREE.STLLoader(manager);
    // 导入树干
    loader.load(
        'model/trunks.stl',
        function (trunkGeometry) {
            let trunkMaterial = new THREE.MeshToonMaterial({
                color: 0x754426,
            });
            let trunks = new THREE.Mesh(trunkGeometry, trunkMaterial);

            trunks.position.set(30, 0, 0);
            trunks.rotation.set(-Math.PI / 2, 0, 0);
            trunks.scale.set(2, 2, 2);

            trunks.castShadow = true;
            trunks.receiveShadow = true;

            sandboxes.add(trunks)
        },
    )

    // 导入树叶
    loader.load(
        'model/leaves.stl',
        function (leavesGeometry) {
            let leavesMaterial = new THREE.MeshToonMaterial({
                color: 0x106B3B,
            });
            let leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);

            leaves.position.set(30, 0, 0);
            leaves.rotation.set(-Math.PI / 2, 0, 0);
            leaves.scale.set(2, 2, 2);

            leaves.castShadow = true;
            leaves.receiveShadow = true;

            sandboxes.add(leaves)
        },
    )

    // 导入浮岛
    loader.load(
        'model/island.stl',
        function (island1Geometry) {
            let island1Material = new THREE.MeshStandardMaterial({
                color: 0x45494A,
                metalness: 0,
                roughness: 0.8
            });
            let island1 = new THREE.Mesh(island1Geometry, island1Material);

            island1.position.set(0, 0, 0);
            island1.rotation.set(-Math.PI / 2, 0, 0);
            island1.scale.set(2, 2, 1.5);

            island1.castShadow = true;

            // 第二个沙盘
            let island2Material = new THREE.MeshStandardMaterial({
                color: 0xFF9245,
                metalness: 0,
                roughness: 0.8
            });
            let island2 = new THREE.Mesh(island1Geometry, island2Material);
            island2.scale.set(2, 2, 1.5)
            island2.rotateX(Math.PI / -2);
            island2.rotateZ(Math.PI / 2)
            island2.translateY(-30);

            // 第三个沙盘
            let island3 = island1.clone();
            island3.translateX(60);

            sandboxes.add(island1);
            sandboxes.add(island2);
            sandboxes.add(island3);
        },
    )


    // 创建贴图
    // 工程地图
    let mapProjectTexture = new THREE.TextureLoader().load("img/project.png");
    mapProjectTexture.wrapS = THREE.RepeatWrapping;
    let mapProjectPlane = new THREE.PlaneGeometry(10, 10);
    let mapProjectMaterial = new THREE.MeshToonMaterial({map: mapProjectTexture});
    let mapProject = new THREE.Mesh(mapProjectPlane, mapProjectMaterial);

    mapProject.rotateX(-Math.PI / 2);
    mapProject.receiveShadow = true;

    sandboxes.add(mapProject);

    // 距离地图
    let mapChengduTexture = new THREE.TextureLoader().load("img/map.jpg");
    mapChengduTexture.wrapS = THREE.RepeatWrapping;
    let mapChengduPlane = new THREE.PlaneGeometry(10, 10);
    let mapChengduMaterial = new THREE.MeshToonMaterial({map: mapChengduTexture});
    let mapChengdu = new THREE.Mesh(mapChengduPlane, mapChengduMaterial);

    mapChengdu.translateX(30);
    mapChengdu.rotateX(-Math.PI / 2);
    mapChengdu.receiveShadow = true;

    sandboxes.add(mapChengdu);

    // 词云
    let wordCloudTexture = new THREE.TextureLoader().load("img/wordcloud.png");
    wordCloudTexture.wrapS = THREE.RepeatWrapping;
    let wordCloudPlane = new THREE.PlaneGeometry(10, 10);
    let wordCloudMaterial = new THREE.MeshToonMaterial({map: wordCloudTexture});
    let wordCloud = new THREE.Mesh(wordCloudPlane, wordCloudMaterial);

    wordCloud.translateX(60);
    wordCloud.rotateX(-Math.PI / 2);
    wordCloud.receiveShadow = true;

    sandboxes.add(wordCloud);

    sandboxes.translateY(-3)


    // 创建聚光灯
    let spotLight = new THREE.SpotLight(0xBBBBBB);
    spotLight.bias = 0.1;
    spotLight.position.x = -10;
    spotLight.position.y = 15;
    spotLight.position.z = 18;
    spotLight.castShadow = true;

    // 阴影质量设置
    spotLight.shadow.penumbra = 12  // 衰减
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.angle = Math.PI / 10;

    scene.add(spotLight);


    // 创建环境光
    let ambientLight = new THREE.AmbientLight(0x393939);
    scene.add(ambientLight);


    // 定位摄像机，指向场景中心
    camera.position.x = 0;
    camera.position.y = 10;
    camera.position.z = 25;
    camera.lookAt(0, 0, 0);

    // // 添加三维坐标
    // let axes = new THREE.AxesHelper(15)
    // scene.add(axes)

    // 将渲染器输出添加到html元素中
    document.getElementById("canvas-content").appendChild(renderer.domElement);
    renderer.render(scene, camera);

    // 让模型保持更新
    function update() {
        renderer.render(scene, camera);
        window.requestAnimationFrame(update);
    }

    window.requestAnimationFrame(update);


    // 动画
    document.addEventListener("keydown", arrowKeyEvent, false);
    document.getElementById("arrow-right").addEventListener("click", () => {
        // 判断intro-screen是否关闭
        if (document.getElementById("intro-screen").style.visibility !== "hidden") {
            return;
        }
        // 判断之前的移动动画是否结束
        if (sandboxesMoving === true) {
            return;
        }
        if (cameraMoving === true) {
            return;
        }
        if (isScrolling === true) {
            return;
        }

        sandboxSwitcher(true);
    })
    document.getElementById("arrow-left").addEventListener("click", () => {
        // 判断intro-screen是否关闭
        if (document.getElementById("intro-screen").style.visibility !== "hidden") {
            return;
        }
        // 判断之前的移动动画是否结束
        if (sandboxesMoving === true) {
            return;
        }
        if (cameraMoving === true) {
            return;
        }
        if (isScrolling === true) {
            return;
        }

        sandboxSwitcher(false);
    })
    document.getElementById("arrow-up-down").addEventListener("click", () => {
        // 判断intro-screen是否关闭
        if (document.getElementById("intro-screen").style.visibility !== "hidden") {
            return;
        }
        // 判断之前的移动动画是否结束
        if (sandboxesMoving === true) {
            return;
        }
        if (cameraMoving === true) {
            return;
        }
        if (isScrolling === true) {
            return;
        }

        if (enableCameraMoving === false) {
            if (enableScroll === true) {
                if (scrolledUp === false) {
                    scrollPassage(true);
                    return;
                } else {
                    scrollPassage(false);
                    return;
                }
            }
        }
        if (topAngle === false) {
            angleSwitcher(true);
        } else {
            angleSwitcher(false);
        }
    })

    let sandboxesMoving = false;
    let topAngle = false;
    let elementMovedDistance = 0;
    let enableCameraMoving = true;
    let enableScroll = false;
    let scrolledUp = false;
    let isScrolling = false;

    function arrowKeyEvent(event) {
        // 判断intro-screen是否关闭
        if (document.getElementById("intro-screen").style.visibility !== "hidden") {
            return
        }
        // 判断之前的移动动画是否结束
        if (sandboxesMoving === true) {
            return;
        }
        if (cameraMoving === true) {
            return;
        }
        if (isScrolling === true) {
            return;
        }

        let keyCode = event.which;
        if (keyCode === 39) {
            sandboxSwitcher(true);
            return;
        }
        if (keyCode === 37) {
            sandboxSwitcher(false);
            return;
        }
        // 判断是否启用镜头移动，如果没有，判断是否启用文字滚动，如果没有，则停止识别
        if (enableCameraMoving === false) {
            if (enableScroll === true) {
                if (keyCode === 38) {
                    scrollPassage(true);
                    return;
                }
                if (keyCode === 40) {
                    scrollPassage(false);
                    return;
                }
            } else {
                return;
            }
        }
        if (keyCode === 38) {
            angleSwitcher(true);
            return;
        }
        if (keyCode === 40) {
            angleSwitcher(false);
        }
    }


    function sandboxSwitcher(direction) {
        // 预设位置
        let targetPositionsArray = [-75, -60, -45, -30, -15, 0];

        sandboxesMoving = true;

        // 读取移动前的位置
        let position = new THREE.Vector3();
        position.setFromMatrixPosition(sandboxes.matrixWorld);
        let originalPosition = position.x;

        // 当移动前位置在-75
        if (originalPosition === targetPositionsArray[0]) {
            if (direction === true) {
                sandboxesMoving = false;
                return;  // 移动到尽头，不移动
            }

            // 移动前移回镜头
            if (topAngle === true) {
                angleSwitcher(false);
            }
            moveX(sandboxes, 15);
            return;
        }

        // 当移动前位置在0
        if (originalPosition === targetPositionsArray[targetPositionsArray.length - 1]) {
            if (direction === false) {
                sandboxesMoving = false;
                return;  // 移动到尽头，不移动
            }
            // 移动前移回镜头
            if (topAngle === true) {
                angleSwitcher(false);
            }
            moveX(sandboxes, -15);
            return;
        }

        // 当移动位置不在尽头
        // 移动前移回镜头
        if (topAngle === true) {
            angleSwitcher(false);
        }
        if (direction === true) {
            moveX(sandboxes, -15);
            return;
        }
        if (direction === false) {
            moveX(sandboxes, 15);
        }


        function moveX(object, distance) {
            // 背后文字透明度动画
            if (originalPosition === 0) {
                enableCameraMoving = false;
                document.getElementById("arrow-up-down-tip").style.color = "rgba(255,255,255,0.3)";
                document.getElementById("arrow-up-down-shortcut").style.color = "rgba(255,255,255,0.3)";

                document.getElementById("passage1").style.textShadow = "0 0 10px rgba(255, 255, 255, 1)";
                document.getElementById("passage2").style.textShadow = "0 0 0 rgba(255, 255, 255, 1)";
            }
            if (originalPosition === -15) {
                enableCameraMoving = true;
                document.getElementById("arrow-up-down-tip").style.color = "rgba(255,255,255,1)";
                document.getElementById("arrow-up-down-shortcut").style.color = "rgba(255,255,255,0.6)";
                if (distance > 0) {
                    document.getElementById("passage2").style.textShadow = "0 0 10px rgba(255, 255, 255, 1)";
                    document.getElementById("passage1").style.textShadow = "0 0 0 rgba(255, 255, 255, 1)";
                } else {
                    document.getElementById("passage2").style.textShadow = "0 0 10px rgba(255, 255, 255, 1)";
                    document.getElementById("passage3").style.textShadow = "0 0 0 rgba(255, 255, 255, 1)";
                }
            }
            if (originalPosition === -30) {
                enableCameraMoving = false;
                document.getElementById("arrow-up-down-tip").style.color = "rgba(255,255,255,0.3)";
                document.getElementById("arrow-up-down-shortcut").style.color = "rgba(255,255,255,0.3)";
                if (distance > 0) {
                    document.getElementById("passage3").style.textShadow = "0 0 10px rgba(255, 255, 255, 1)";
                    document.getElementById("passage2").style.textShadow = "0 0 0 rgba(255, 255, 255, 1)";
                } else {
                    document.getElementById("passage3").style.textShadow = "0 0 10px rgba(255, 255, 255, 1)";
                    document.getElementById("passage4").style.textShadow = "0 0 0 rgba(255, 255, 255, 1)";
                }
            }
            if (originalPosition === -45) {
                enableCameraMoving = true;
                document.getElementById("arrow-up-down-tip").style.color = "rgba(255,255,255,1)";
                document.getElementById("arrow-up-down-shortcut").style.color = "rgba(255,255,255,0.6)";
                if (distance > 0) {
                    document.getElementById("passage4").style.textShadow = "0 0 10px rgba(255, 255, 255, 1)";
                    document.getElementById("passage3").style.textShadow = "0 0 0 rgba(255, 255, 255, 1)";
                } else {
                    document.getElementById("passage4").style.textShadow = "0 0 10px rgba(255, 255, 255, 1)";
                    document.getElementById("passage5").style.textShadow = "0 0 0 rgba(255, 255, 255, 1)";
                }
            }
            if (originalPosition === -60) {
                if (distance > 0) {
                    enableCameraMoving = false;
                    document.getElementById("arrow-up-down-tip").style.color = "rgba(255,255,255,0.3)";
                    document.getElementById("arrow-up-down-shortcut").style.color = "rgba(255,255,255,0.3)";

                    document.getElementById("passage5").style.textShadow = "0 0 10px rgba(255, 255, 255, 1)";
                    document.getElementById("passage4").style.textShadow = "0 0 0 rgba(255, 255, 255, 1)";
                } else {
                    enableCameraMoving = false;
                    enableScroll = true;
                    document.getElementById("passage5").style.textShadow = "0 0 10px rgba(255, 255, 255, 1)";
                    document.getElementById("passage6").style.textShadow = "0 0 0 rgba(255, 255, 255, 1)";
                }
            }
            if (originalPosition === -75) {
                if (scrolledUp === true) {
                    scrollPassage(false);
                }
                enableCameraMoving = true;
                document.getElementById("arrow-up-down-tip").style.color = "rgba(255,255,255,1)";
                document.getElementById("arrow-up-down-shortcut").style.color = "rgba(255,255,255,0.6)";
                enableScroll = false;
                document.getElementById("passage6").style.textShadow = "0 0 10px rgba(255, 255, 255, 1)";
                document.getElementById("passage5").style.textShadow = "0 0 0 rgba(255, 255, 255, 1)";
            }
            let movedDistance = 0;  // 初始化移动距离

            window.requestAnimationFrame(moveXAction);


            function moveXAction() {
                // 当移动距离达到目标距离时退出函数
                if (movedDistance === Math.abs(distance)) {
                    object.position.x = originalPosition + distance;
                    movedDistance = 0;  // 重置本次移动距离
                    sandboxesMoving = false;
                    return;
                }
                object.translateX(distance / 40);
                movedDistance += Math.abs(distance / 40);
                if (distance > 0) {
                    elementMovedDistance += 1;
                } else {
                    elementMovedDistance -= 1;
                }
                document.getElementById("passages").style.transform = "translate(" + elementMovedDistance + "%)";

                renderer.render(scene, camera);

                window.requestAnimationFrame(moveXAction);
            }
        }
    }

    let cameraMoving = false;

    function angleSwitcher(direction) {

        cameraMoving = true;

        if (direction === true) {
            if (topAngle === true) {
                // 已移动到尽头，不移动
                cameraMoving = false;
                return;
            }


            moveCamera(25, 0, 10);
            topAngle = true;
            document.getElementById("arrow-up-down-tip").textContent = "　返回　";
            document.getElementById("arrow-up-down-shortcut").textContent = "↓";
        }
        if (direction === false) {
            if (topAngle === false) {
                // 已移动到尽头，不移动
                cameraMoving = false;
                return;
            }
            moveCamera(0, 25, 10);
            topAngle = false;
            document.getElementById("arrow-up-down-tip").textContent = "详细信息";
            document.getElementById("arrow-up-down-shortcut").textContent = "↑";
        }

        function moveCamera(startZ, finishZ, Y) {
            // 初始化移动距离
            let movedDistanceZ = 0;
            // 初始化文章移动距离
            let passageDistance = 0;
            if (startZ > finishZ) {
                passageDistance = 0;
            } else {
                passageDistance = 80;
            }


            // 把总距离分成40份作为一步长
            let deltaZ = finishZ - startZ;
            let stepZ = deltaZ / 40;

            window.requestAnimationFrame(moveCameraAction);

            // 镜头慢慢指向sandboxes的高度
            let lookAtY = 0;
            if (startZ > finishZ) {
                lookAtY = 0;
            } else {
                lookAtY = -3;
            }

            function moveCameraAction() {
                // 当移动距离达到目标距离时退出函数
                if (movedDistanceZ === Math.abs(deltaZ)) {
                    cameraMoving = false;
                    movedDistanceZ = 0; // 重置
                    return;
                }
                camera.translateZ(stepZ);
                camera.position.y = Y;
                movedDistanceZ += Math.abs(stepZ);

                // 调整镜头指向
                camera.lookAt(0, lookAtY, 0);
                if (startZ > finishZ) {
                    lookAtY -= 3 / 40;
                } else {
                    lookAtY += 3 / 40;
                }

                // 调整文章
                if (startZ > finishZ) {
                    passageDistance += 2;
                } else {
                    passageDistance -= 2;
                }

                document.getElementById("passages").style.marginTop = passageDistance + "em";
                renderer.render(scene, camera);

                window.requestAnimationFrame(moveCameraAction);
            }
        }
    }

    function scrollPassage(direction) {
        isScrolling = true;
        // 初始化文章移动距离
        let passageDistance = 0;
        if (direction === true) {
            passageDistance = 0;
        } else {
            passageDistance = -25;
        }

        window.requestAnimationFrame(scrollY);

        function scrollY() {
            // 停止条件
            if (direction === true) {
                if (passageDistance === -25) {
                    passageDistance = 0;  // 重置
                    scrolledUp = true;
                    document.getElementById("arrow-up-down-tip").textContent = "　返回　";
                    document.getElementById("arrow-up-down-shortcut").textContent = "↓";
                    isScrolling = false;
                    return;
                }
            } else {
                if (passageDistance === 0) {
                    passageDistance = 0;  // 重置
                    scrolledUp = false;
                    document.getElementById("arrow-up-down-tip").textContent = "详细信息";
                    document.getElementById("arrow-up-down-shortcut").textContent = "↑";
                    isScrolling = false;
                    return;
                }
            }
            // 调整文章
            if (direction === true) {
                passageDistance -= 1;
            } else {
                passageDistance += 1;
            }
            document.getElementById("passage6").style.marginTop = passageDistance + "em";
            renderer.render(scene, camera);
            window.requestAnimationFrame(scrollY);
        }
    }
}

// 加载完毕页面后执行init函数
window.onload = init