function init() {
    // 创建场景
    let scene = new THREE.Scene();
    // 创建沙盘群组
    let sandbox1 = new THREE.Object3D();
    scene.add(sandbox1)
    // 设置摄像机
    let aspectRatio = window.innerWidth / window.innerHeight; // 确定当前窗口长宽比以用于摄影机设置
    let camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 2000); // 0.1 和 2000 是最近和最远距离
    // 创建渲染器
    let renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    // 设置输出canvas画面的大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // 设置渲染物体阴影
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; // options are THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap

    // 导入树干
    let loader = new THREE.STLLoader();
    loader.load(
        'trunks.stl',
        function (trunkGeometry) {
            let trunkMaterial = new THREE.MeshStandardMaterial({
                color: 0xC27749,
                metalness: 1,
                roughness: 0.8
            });
            let trunks = new THREE.Mesh(trunkGeometry, trunkMaterial);

            trunks.position.set(0, 0, 0);
            trunks.rotation.set(-Math.PI / 2, 0, 0);
            trunks.scale.set(2, 2, 2);

            trunks.castShadow = true;
            trunks.receiveShadow = true;

            sandbox1.add(trunks)
        },
    )

    // 导入树叶
    let loader2 = new THREE.STLLoader();
    loader2.load(
        'leaves.stl',
        function (leavesGeometry) {
            let leavesMaterial = new THREE.MeshStandardMaterial({
                color: 0x6FFF82,
                metalness: 0.6,
                roughness: 0.8
            });
            let leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);

            leaves.position.set(0, 0, 0);
            leaves.rotation.set(-Math.PI / 2, 0, 0);
            leaves.scale.set(2, 2, 2);

            leaves.castShadow = true;
            leaves.receiveShadow = true;

            sandbox1.add(leaves)
        },
    )

    // 导入浮岛
    let loader3 = new THREE.STLLoader();
    loader3.load(
        'island.stl',
        function (island1Geometry) {
            let island1Material = new THREE.MeshStandardMaterial({
                color: 0xCE915F,
                metalness: 0,
                roughness: 0.8
            });
            let island1 = new THREE.Mesh(island1Geometry, island1Material);

            island1.position.set(0, 0, 0);
            island1.rotation.set(-Math.PI / 2, 0, 0);
            island1.scale.set(2, 2, 1.5);

            island1.castShadow = true;

            sandbox1.add(island1);
        },
    )


    // 创建贴图
    let mapChengduTexture = new THREE.TextureLoader().load("map.jpg");
    mapChengduTexture.wrapS = THREE.RepeatWrapping;


    // 创建地图平面
    let mapChengduPlane = new THREE.PlaneGeometry(10, 10);
    let mapChengduMaterial = new THREE.MeshToonMaterial({map: mapChengduTexture});
    let mapChengdu = new THREE.Mesh(mapChengduPlane, mapChengduMaterial);

    mapChengdu.rotation.x = -Math.PI / 2;
    mapChengdu.receiveShadow = true;

    sandbox1.add(mapChengdu);


    // 将sandbox1整体上移 1
    sandbox1.translateY(1)

    // 创建聚光灯
    let spotLight1 = new THREE.SpotLight(0xBBBBBB);
    spotLight1.bias = 0.1
    spotLight1.position.x = -12;
    spotLight1.position.y = 15;
    spotLight1.position.z = 18;
    spotLight1.castShadow = true;

    // 阴影质量设置
    spotLight1.shadow.penumbra = 12  // 衰减
    spotLight1.shadow.mapSize.width = 2048;
    spotLight1.shadow.mapSize.height = 2048;
    spotLight1.angle = Math.PI / 10;

    scene.add(spotLight1)


    // 创建环境光
    let ambientLight = new THREE.AmbientLight(0x393939);
    scene.add(ambientLight)


    // 定位摄像机，指向场景中心
    camera.position.x = -5;
    camera.position.y = 10;
    camera.position.z = 25;
    camera.lookAt(scene.position);

    // 将渲染器输出添加到html元素中
    document.getElementById("canvas-content").appendChild(renderer.domElement);
    renderer.render(scene, camera);

    // 旋转动画
    let T0 = new Date();

    function render() {
        let T1 = new Date();
        let t = T1 - T0;
        T0 = T1;
        renderer.render(scene, camera);
        controls.update();  // 更新

        window.requestAnimationFrame(render);
    }

    window.requestAnimationFrame(render);


    // 创建控制器对象
    let controls = new THREE.OrbitControls(camera, renderer.domElement);

    // 限制控制器
    controls.maxDistance = 100;
    controls.maxPolarAngle = Math.PI * 60 / 128;
    controls.minDistance = 3;
    controls.minZoom = 50;
    controls.maxZoom = 1000;
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;

    // 监听控制器的鼠标事件，执行渲染内容
    controls.addEventListener('change', () => {
        renderer.render(scene, camera);
    });
}

// 加载完毕页面后执行init函数
window.onload = init