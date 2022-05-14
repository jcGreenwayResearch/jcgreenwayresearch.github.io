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
    manager.onError = function (url) {
        document.getElementById("start-button").style.visibility = "visible";
        document.getElementById("start-button").textContent = "有错误 仍然开始";
        document.getElementById("loading-animation").style.visibility = "hidden";
    };

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

            trunks.position.set(0, 0, 0);
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

            leaves.position.set(0, 0, 0);
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
                color: 0xFF9245,
                metalness: 0,
                roughness: 0.8
            });
            let island1 = new THREE.Mesh(island1Geometry, island1Material);

            island1.position.set(0, 0, 0);
            island1.rotation.set(-Math.PI / 2, 0, 0);
            island1.scale.set(2, 2, 1.5);

            island1.castShadow = true;

            sandboxes.add(island1);
        },
    )


    // 创建贴图
    let mapChengduTexture = new THREE.TextureLoader().load("img/map.jpg");
    mapChengduTexture.wrapS = THREE.RepeatWrapping;


    // 创建地图平面
    let mapChengduPlane = new THREE.PlaneGeometry(10, 10);
    let mapChengduMaterial = new THREE.MeshToonMaterial({map: mapChengduTexture});
    let mapChengdu = new THREE.Mesh(mapChengduPlane, mapChengduMaterial);

    mapChengdu.rotation.x = -Math.PI / 2;
    mapChengdu.receiveShadow = true;

    sandboxes.add(mapChengdu);

    let cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
    let cubeMaterial = new THREE.MeshToonMaterial({color: 0x7B7BEF});
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    // 添加方块
    cube.translateX(15);
    cube.rotateX(Math.PI / 4);
    cube.rotateY(Math.PI / 4);
    cube.rotateZ(Math.PI / 4);
    sandboxes.add(cube);

    // 创建聚光灯
    let spotLight = new THREE.SpotLight(0xBBBBBB);
    spotLight.bias = 0.1
    spotLight.position.x = -10;
    spotLight.position.y = 15;
    spotLight.position.z = 18;
    spotLight.castShadow = true;

    // 阴影质量设置
    spotLight.shadow.penumbra = 12  // 衰减
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.angle = Math.PI / 10;

    scene.add(spotLight)


    // 创建环境光
    let ambientLight = new THREE.AmbientLight(0x393939);
    scene.add(ambientLight)


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
            return
        }
        // 判断之前的移动动画是否结束
        if (sandboxesMoving === true) {
            return
        }

        sandboxSwitcher(true);
    })
    document.getElementById("arrow-left").addEventListener("click", () => {
        // 判断intro-screen是否关闭
        if (document.getElementById("intro-screen").style.visibility !== "hidden") {
            return
        }
        // 判断之前的移动动画是否结束
        if (sandboxesMoving === true) {
            return
        }

        sandboxSwitcher(false);
    })
    document.getElementById("arrow-up-down").addEventListener("click", () => {
        // 判断intro-screen是否关闭
        if (document.getElementById("intro-screen").style.visibility !== "hidden") {
            return
        }
        // 判断之前的移动动画是否结束
        if (sandboxesMoving === true) {
            return
        }
        if (topAngle === false) {
            angleSwitcher(true);
            return;
        }
        if (topAngle === true) {
            angleSwitcher(false);
        }
    })

    let sandboxesMoving = false;
    let topAngle = false;
    let elementMovedDistance = 0;

    function arrowKeyEvent(event) {
        // 判断intro-screen是否关闭
        if (document.getElementById("intro-screen").style.visibility !== "hidden") {
            return
        }
        // 判断之前的移动动画是否结束
        if (sandboxesMoving === true) {
            return
        }

        let keyCode = event.which;
        if (keyCode === 39) {
            sandboxSwitcher(true);
        }
        if (keyCode === 37) {
            sandboxSwitcher(false);
        }
        if (keyCode === 38) {
            angleSwitcher(true);
        }
        if (keyCode === 40) {
            angleSwitcher(false);
        }
    }


    function sandboxSwitcher(direction) {
        // 预设位置
        let targetPositionsArray = [-30, -15, 0];

        sandboxesMoving = true;

        // 读取移动前的位置
        let position = new THREE.Vector3();
        position.setFromMatrixPosition(sandboxes.matrixWorld);
        let originalPosition = position.x;

        // 当移动前位置在-30
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
                document.getElementById("passage1").style.color = "rgba(255, 255, 255, 0.3)";
                document.getElementById("passage2").style.color = "rgba(255, 255, 255, 1)";
            }
            if (originalPosition === -15) {
                if (distance > 0) {
                    document.getElementById("passage2").style.color = "rgba(255, 255, 255, 0.3)";
                    document.getElementById("passage1").style.color = "rgba(255, 255, 255, 1)";
                } else {
                    document.getElementById("passage2").style.color = "rgba(255, 255, 255, 0.3)";
                    document.getElementById("passage3").style.color = "rgba(255, 255, 255, 1)";
                }
            }
            if (originalPosition === -30) {
                document.getElementById("passage3").style.color = "rgba(255, 255, 255, 0.3)";
                document.getElementById("passage2").style.color = "rgba(255, 255, 255, 1)";
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
                elementMovedDistance += distance / 15;
                document.getElementById("under-canvas").style.transform = "translate(" + elementMovedDistance + "em)";

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
            document.getElementById("arrow-up-down-tip").textContent = "还原镜头";
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
            document.getElementById("arrow-up-down-tip").textContent = "　鸟瞰　";
            document.getElementById("arrow-up-down-shortcut").textContent = "↑";
        }

        function moveCamera(startZ, finishZ, Y) {
            // 初始化移动距离
            let movedDistanceZ = 0;


            // 把总距离分成40份作为一步长
            let deltaZ = finishZ - startZ;
            let stepZ = deltaZ / 40;

            window.requestAnimationFrame(moveCameraAction);

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
                camera.lookAt(0, 0, 0);

                renderer.render(scene, camera);

                window.requestAnimationFrame(moveCameraAction);
            }
        }
    }
}

// 加载完毕页面后执行init函数
window.onload = init