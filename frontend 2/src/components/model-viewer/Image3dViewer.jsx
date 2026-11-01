import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, TransformControls } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
import {
  Box,
  Stack,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
  Fade,
} from '@mui/material'
import {
  PanTool,
  RotateRight,
  ZoomIn,
  Fullscreen,
  Lightbulb,
  GridOn,
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'

// ----------- Styled Components ------------

/**
 * Main container for the 3D viewer, with rounded corners and dark gradient.
 */
const ViewerContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '80vh',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
}))

/**
 * IconButton with visual feedback for active mode (move/rotate/scale/grid/lights).
 */
const ControlButton = styled(IconButton)(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.primary.main : 'rgba(255,255,255,0.1)',
  color: active ? '#fff' : 'rgba(255,255,255,0.7)',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : 'rgba(255,255,255,0.2)',
  },
  transition: 'all 0.3s ease',
}))

/**
 * Overlay panel for viewer controls.
 */
const ControlPanel = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: theme.spacing(2),
  background: 'rgba(0,0,0,0.7)',
  backdropFilter: 'blur(10px)',
  zIndex: 10,
}))

/**
 * Component to load and render a GLTF model with transform controls.
 * - `modelPath`: path to .gltf/.glb file
 * - `initialPosition`: starting position (array of x, y, z)
 * - `mode`: 'translate', 'rotate', or 'scale'
 */
function Furniture({ modelPath, initialPosition = [0, 0, 0], mode = 'translate' }) {
  const { scene } = useGLTF(modelPath)
  const objectRef = useRef()
  const transformRef = useRef()

  // Attach object to transform controls after mount/update
  useEffect(() => {
    if (objectRef.current && transformRef.current) {
      transformRef.current.attach(objectRef.current)
    }
  }, [scene])

  return (
    <>
      <primitive
        object={scene}
        ref={objectRef}
        position={initialPosition}
        scale={1.5}
      />
      <TransformControls ref={transformRef} mode={mode} />
    </>
  )
}

/**
 * Main interactive 3D scene viewer for furniture/room
 */
export default function SofaScene() {
  // ----------- State Management -----------
  const [mode, setMode] = useState('translate') // transform: move/rotate/scale
  const [showGrid, setShowGrid] = useState(true) // show/hide grid
  const [showLights, setShowLights] = useState(true) // show/hide lighting
  const [isFullscreen, setIsFullscreen] = useState(false) // fullscreen toggle
  const theme = useTheme()

  // ----------- Fullscreen Handler -----------
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // ----------- Render Section -----------
  return (
    <Fade in timeout={800}>
      <Box sx={{ p: 3, height: '100%' }}>
        <Stack spacing={3}>
          {/* ---------- Title ---------- */}
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            3D Furniture Viewer
          </Typography>

          {/* ---------- 3D Viewer Container ---------- */}
          <ViewerContainer>
            {/* --------- Overlay Control Panel --------- */}
            <ControlPanel>
              <Stack direction="row" spacing={1}>
                {/* Move mode */}
                <Tooltip title="Move">
                  <ControlButton
                    active={mode === 'translate'}
                    onClick={() => setMode('translate')}
                  >
                    <PanTool />
                  </ControlButton>
                </Tooltip>
                {/* Rotate mode */}
                <Tooltip title="Rotate">
                  <ControlButton
                    active={mode === 'rotate'}
                    onClick={() => setMode('rotate')}
                  >
                    <RotateRight />
                  </ControlButton>
                </Tooltip>
                {/* Scale mode */}
                <Tooltip title="Scale">
                  <ControlButton
                    active={mode === 'scale'}
                    onClick={() => setMode('scale')}
                  >
                    <ZoomIn />
                  </ControlButton>
                </Tooltip>
                {/* Toggle grid */}
                <Tooltip title="Toggle Grid">
                  <ControlButton
                    active={showGrid}
                    onClick={() => setShowGrid(!showGrid)}
                  >
                    <GridOn />
                  </ControlButton>
                </Tooltip>
                {/* Toggle lights */}
                <Tooltip title="Toggle Lights">
                  <ControlButton
                    active={showLights}
                    onClick={() => setShowLights(!showLights)}
                  >
                    <Lightbulb />
                  </ControlButton>
                </Tooltip>
                {/* Fullscreen mode */}
                <Tooltip title="Fullscreen">
                  <ControlButton onClick={toggleFullscreen}>
                    <Fullscreen />
                  </ControlButton>
                </Tooltip>
              </Stack>
            </ControlPanel>

            {/* ---------- 3D Canvas ---------- */}
            <Canvas
              camera={{ position: [0, 3, 8], fov: 45 }}
              style={{ background: 'transparent' }}
            >
              {/* Add lighting if enabled */}
              {showLights && (
                <>
                  <ambientLight intensity={0.7} />
                  <directionalLight position={[5, 5, 5]} intensity={1} />
                  <spotLight
                    position={[-5, 5, 0]}
                    angle={0.3}
                    penumbra={1}
                    intensity={0.5}
                  />
                </>
              )}
              {/* Add grid helper if enabled */}
              {showGrid && <gridHelper args={[20, 20, '#666666', '#444444']} />}
              {/* Camera orbit controls */}
              <OrbitControls
                enableDamping
                dampingFactor={0.05}
                minDistance={3}
                maxDistance={20}
              />
              {/* Main room model */}
              <Furniture
                modelPath="/models/shapespark-example-room.gltf"
                initialPosition={[0, 0, 0]}
              />
              {/* Movable/scalable/rotatable sofa */}
              <Furniture
                modelPath="/models/leather-sofa-gltf.glb"
                initialPosition={[2, 0, 2]}
                mode={mode}
              />
            </Canvas>
          </ViewerContainer>

          {/* ---------- Instructions ---------- */}
          <Typography variant="body2" color="text.secondary" align="center">
            Use mouse to orbit, scroll to zoom, and right-click to pan. Select a control mode to manipulate the furniture.
          </Typography>
        </Stack>
      </Box>
    </Fade>
  )
}
