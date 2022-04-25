function init() {
    // 创建场景
    let scene = new THREE.Scene();
    // 创建沙盘群组
    let sandbox = new THREE.Object3D();
    scene.add(sandbox)
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
    renderer.shadowMapType = THREE.PCFSoftShadowMap; // options are THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap


//     // 显示三维坐标系
//     let axes = new THREE.AxesHelper(20);
//     // 添加坐标系到场景中
//     scene.add(axes);

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

            sandbox.add(trunks)
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

            sandbox.add(leaves)
        },
    )

    // 导入浮岛
    let loader3 = new THREE.STLLoader();
    loader3.load(
        'island.stl',
        function (IslandGeometry) {
            let IslandMaterial = new THREE.MeshStandardMaterial({
                color: 0xCE915F,
                metalness: 0,
                roughness: 0.8
            });
            let island = new THREE.Mesh(IslandGeometry, IslandMaterial);

            island.position.set(0, 0, 0);
            island.rotation.set(-Math.PI / 2, 0, 0);
            island.scale.set(2, 2, 1.5);

            island.castShadow = true;

            sandbox.add(island);
        },
    )


    // 创建贴图
    let mapTexture = new THREE.TextureLoader().load("map.jpg");
    mapTexture.wrapS = THREE.RepeatWrapping;


    // 创建地图平面
    let mapPlane = new THREE.PlaneGeometry(10, 10);
    let mapMaterial = new THREE.MeshToonMaterial({map: mapTexture});
    let map = new THREE.Mesh(mapPlane, mapMaterial);

    map.rotation.x = -Math.PI / 2;
    map.receiveShadow = true;

    sandbox.add(map);


    // 创建聚光灯
    let spotlight = new THREE.SpotLight(0xFFFFFF);
    spotlight.bias = 0.1
    spotlight.position.x = -50;
    spotlight.position.y = 80;
    spotlight.position.z = 100;
    spotlight.castShadow = true;

    // 阴影质量设置
    spotlight.shadow.penumbra = 0.05  // 衰减
    spotlight.shadow.mapSize.width = 2048;
    spotlight.shadow.mapSize.height = 2048;
    spotlight.angle = Math.PI / 10;

    scene.add(spotlight)



    // 定位摄像机，指向场景中心
    camera.position.x = -3;
    camera.position.y = 6;
    camera.position.z = 15;
    camera.lookAt(scene.position);

    // 将渲染器输出添加到html元素中
    document.getElementById("webg1-output").appendChild(renderer.domElement);
    renderer.render(scene, camera);

    // // 旋转动画
    // let T0 = new Date();
    //
    // function render() {
    //     let T1 = new Date();
    //     let t = T1 - T0;
    //     T0 = T1;
    //     renderer.render(scene, camera);
    //
    //     sandbox.rotateY(t * 0.00003)
    //
    //     window.requestAnimationFrame(render);
    // }
    //
    // window.requestAnimationFrame(render);


    // 创建控制器对象
    let controls = new THREE.OrbitControls(camera, renderer.domElement);

    // 限制控制器
    controls.enableDamping = true;  // 增加阻尼
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI * 60 / 128;
    controls.minZoom = 50;
    controls.maxZoom = 1000;

    // 监听控制器的鼠标事件，执行渲染内容
    controls.addEventListener('change', () => {
        renderer.render(scene, camera);
    });
    controls.update();  // 更新
}

// 加载完毕页面后执行init函数
window.onload = init
