import { useRef, useEffect, useState } from 'react';
import { Contact, PhysicsNode, CustomCategory, UserProfile } from '../types';
import { drawFigureCanvas } from '../utils/canvasAvatar';
import { getCategoryColor } from '../utils/colors';
import { styles } from '../styles';
import { solveRepulsion, solveAttraction, updatePositions } from '../utils/physicsEngine';
import { getLayoutPosition } from '../utils/helpers';
import {
  getProjectedNodes,
  findNodeAtCursor,
  findLinkAtCursor,
  calculate3DDragDelta
} from '../utils/archipelago3dHelpers';

interface Archipelago3DProps {
  contacts: Contact[];
  selectedContactId?: string;
  onSelectContact: (c: Contact) => void;
  activeFilter: string;
  onRightClickNode: (contact: Contact, clientX: number, clientY: number) => void;
  onRightClickCanvas: (clientX: number, clientY: number) => void;
  onSelectLink: (c1: Contact, c2: Contact) => void;
  globalAvatarStyle?: 'human' | 'magical';
  onDoubleClickNode?: (contact: Contact) => void;
  onToggleFullscreen?: (fs: boolean) => void;
  onFilterChange?: (filter: string) => void;
  t: (key: string) => string;
  isFullscreen?: boolean;
  customCategories?: CustomCategory[];
  userProfile?: UserProfile;
}

/**
 * 3D Physics-based Archipelago simulation visualizer.
 * Projects contacts in geometric space shapes (sphere, torus, spiral, dna) with customizable spacing.
 */
export function Archipelago3D({ 
  contacts, 
  selectedContactId, 
  onSelectContact,
  activeFilter,
  onRightClickNode,
  onRightClickCanvas,
  onSelectLink,
  globalAvatarStyle = 'human',
  onDoubleClickNode,
  onToggleFullscreen,
  onFilterChange,
  t,
  isFullscreen = false,
  customCategories = [],
  userProfile
}: Archipelago3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<PhysicsNode[]>([]);
  
  // Physics dragging state
  const isDraggingRef = useRef(false);
  const draggedNodeIdRef = useRef<string | null>(null);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const cameraRotationRef = useRef({ x: 0.1, y: 0.2 });
  const zoomRef = useRef(1.0);
  const hoveredNodeIdRef = useRef<string | null>(null);
  const hoveredLinkIdRef = useRef<string | null>(null);

  const [layoutShape, setLayoutShape] = useState<'sphere' | 'torus' | 'spiral' | 'dna'>('sphere');
  const [isExpanded, setIsExpanded] = useState(false);
  const effectiveExpanded = isExpanded || isFullscreen;
  const [spacing, setSpacing] = useState(() => {
    const saved = localStorage.getItem('crm_3d_spacing');
    return saved ? parseFloat(saved) : 1.0;
  });

  const prevLayoutShapeRef = useRef(layoutShape);
  const prevSpacingRef = useRef(spacing);

  useEffect(() => {
    localStorage.setItem('crm_3d_spacing', String(spacing));
  }, [spacing]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && effectiveExpanded) {
        setIsExpanded(false);
        if (onToggleFullscreen) {
          onToggleFullscreen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [effectiveExpanded, onToggleFullscreen]);

  const handleToggleFullscreen = () => {
    const nextVal = !effectiveExpanded;
    setIsExpanded(nextVal);
    if (onToggleFullscreen) {
      onToggleFullscreen(nextVal);
    }
  };

  const visibleContacts = contacts.filter(c => 
    activeFilter.toLowerCase() === 'all' || 
    c.relations.some(r => r.toLowerCase().startsWith(activeFilter.toLowerCase()))
  );

  useEffect(() => {
    const layoutChanged = prevLayoutShapeRef.current !== layoutShape || prevSpacingRef.current !== spacing;
    prevLayoutShapeRef.current = layoutShape;
    prevSpacingRef.current = spacing;

    const existing = new Map(nodesRef.current.map(n => [n.id, n]));
    
    const contactNodes = visibleContacts.map((c, index) => {
      const targetPos = getLayoutPosition(index, visibleContacts.length, layoutShape);
      const exist = existing.get(c.id);
      if (exist) {
        exist.relations = c.relations;
        exist.avatarConfig = c.avatarConfig;
        exist.avatar = c.avatar;
        exist.name = c.name;
        exist.warmth = c.warmth;
        exist.status = c.status;
        if (layoutChanged) {
          exist.x = targetPos.x * spacing;
          exist.y = targetPos.y * spacing;
          exist.z = targetPos.z * spacing;
          exist.vx = 0;
          exist.vy = 0;
          exist.vz = 0;
        }
        return exist;
      }
      
      return {
        id: c.id,
        name: c.name,
        relations: c.relations,
        status: c.status,
        avatar: c.avatar,
        avatarConfig: c.avatarConfig,
        warmth: c.warmth,
        x: targetPos.x * spacing,
        y: targetPos.y * spacing,
        z: targetPos.z * spacing,
        vx: 0,
        vy: 0,
        vz: 0,
        radius: 20
      };
    });

    if (userProfile) {
      const exist = existing.get('user-profile');
      const userNode = exist ? {
        ...exist,
        name: userProfile.name || 'Human',
        avatarConfig: userProfile.avatarConfig,
        avatar: '👤'
      } : {
        id: 'user-profile',
        name: userProfile.name || 'Human',
        relations: ['User'],
        status: 'active',
        avatar: '👤',
        avatarConfig: userProfile.avatarConfig,
        warmth: 100,
        x: 0,
        y: 0,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        radius: 26
      };
      
      // Lock position at origin
      userNode.x = 0;
      userNode.y = 0;
      userNode.z = 0;
      userNode.vx = 0;
      userNode.vy = 0;
      userNode.vz = 0;

      nodesRef.current = [userNode, ...contactNodes];
    } else {
      nodesRef.current = contactNodes;
    }
  }, [visibleContacts, layoutShape, spacing, userProfile]);

  // Main canvas animation and rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      const p = canvas.parentElement;
      if (p) {
        canvas.width = p.clientWidth;
        canvas.height = p.clientHeight;
      }
    };
    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;
      solveRepulsion(nodes, 6000 * spacing);
      solveAttraction(nodes, 0.02);
      updatePositions(nodes, 0.015, 0.88, draggedNodeIdRef.current);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const angleX = cameraRotationRef.current.x;
      const angleY = cameraRotationRef.current.y;
      const zoom = zoomRef.current;
      const focalLength = 350;

      const projected = getProjectedNodes(nodes, angleX, angleY, zoom, focalLength, cx, cy, selectedContactId);

      // Draw loop ring links
      ctx.lineWidth = 1.0;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        const p2 = projected[(i + 1) % projected.length];
        
        const linkId1 = `${p1.id}-${p2.id}`;
        const linkId2 = `${p2.id}-${p1.id}`;
        const isLinkHovered = hoveredLinkIdRef.current === linkId1 || hoveredLinkIdRef.current === linkId2;

        const grad = ctx.createLinearGradient(p1.screenX, p1.screenY, p2.screenX, p2.screenY);
        const col1 = p1.relations.length > 0 ? getCategoryColor(p1.relations[0]) : '#4b5563';
        const col2 = p2.relations.length > 0 ? getCategoryColor(p2.relations[0]) : '#4b5563';
        
        grad.addColorStop(0, col1);
        grad.addColorStop(1, col2);

        ctx.strokeStyle = grad;
        ctx.lineWidth = isLinkHovered ? 3.0 : 1.2;
        ctx.globalAlpha = isLinkHovered ? 0.95 : 0.28;
        
        ctx.beginPath();
        ctx.moveTo(p1.screenX, p1.screenY);
        ctx.lineTo(p2.screenX, p2.screenY);
        ctx.stroke();
      }

      // Draw explicit connection links (dashed gold line)
      for (const contact of visibleContacts) {
        const conns = contact.connections || [];
        for (const conn of conns) {
          if (contact.id < conn.targetId) {
            const p1 = projected.find(n => n.id === contact.id);
            const p2 = projected.find(n => n.id === conn.targetId);
            if (p1 && p2) {
              const linkId1 = `${p1.id}-${p2.id}`;
              const linkId2 = `${p2.id}-${p1.id}`;
              const isLinkHovered = hoveredLinkIdRef.current === linkId1 || hoveredLinkIdRef.current === linkId2;

              ctx.strokeStyle = isLinkHovered ? '#fbbf24' : 'rgba(251, 191, 36, 0.4)';
              ctx.lineWidth = isLinkHovered ? 3.0 : 1.5;
              ctx.globalAlpha = 1.0;
              ctx.setLineDash([5, 5]);

              ctx.beginPath();
              ctx.moveTo(p1.screenX, p1.screenY);
              ctx.lineTo(p2.screenX, p2.screenY);
              ctx.stroke();
              ctx.setLineDash([]); 

              // Text connection label
              const midX = (p1.screenX + p2.screenX) / 2;
              const midY = (p1.screenY + p2.screenY) / 2;

              ctx.font = '9px Outfit';
              const textWidth = ctx.measureText(conn.type).width;
              ctx.fillStyle = 'rgba(15, 17, 23, 0.85)';
              ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              if (ctx.roundRect) {
                ctx.roundRect(midX - textWidth / 2 - 6, midY - 7, textWidth + 12, 14, 4);
              } else {
                ctx.rect(midX - textWidth / 2 - 6, midY - 7, textWidth + 12, 14);
              }
              ctx.fill();
              ctx.stroke();

              ctx.fillStyle = '#fbbf24';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(conn.type, midX, midY);
            }
          }
        }
      }

      // Draw links from the user profile node to all other contact nodes
      const userNodeProj = projected.find(n => n.id === 'user-profile');
      if (userNodeProj) {
        ctx.strokeStyle = 'rgba(20, 184, 166, 0.28)'; // soft teal
        ctx.lineWidth = 1.0;
        ctx.setLineDash([4, 4]); // dashed link
        for (const p of projected) {
          if (p.id !== 'user-profile') {
            ctx.beginPath();
            ctx.moveTo(userNodeProj.screenX, userNodeProj.screenY);
            ctx.lineTo(p.screenX, p.screenY);
            ctx.stroke();
          }
        }
        ctx.setLineDash([]);
      }

      // Draw nodes back-to-front
      const sorted = [...projected].sort((a, b) => b.depth - a.depth);

      for (const p of sorted) {
        const isHovered = hoveredNodeIdRef.current === p.id;
        const isSelected = selectedContactId === p.id;
        const radius = isSelected ? p.radius * 1.55 : p.radius;
        
        ctx.globalAlpha = (activeFilter.toLowerCase() === 'all' || p.relations.some(r => r.toLowerCase().startsWith(activeFilter.toLowerCase()))) ? 1.0 : 0.25;

        if (isSelected) {
          ctx.strokeStyle = 'rgba(13, 148, 136, 0.8)';
          ctx.lineWidth = 6.0;
          ctx.shadowBlur = 15;
          ctx.shadowColor = 'rgba(13, 148, 136, 0.6)';
          ctx.beginPath();
          ctx.arc(p.screenX, p.screenY, radius + 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0; 
        }

        const grad = ctx.createRadialGradient(
          p.screenX - radius * 0.3,
          p.screenY - radius * 0.3,
          radius * 0.05,
          p.screenX,
          p.screenY,
          radius
        );
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
        grad.addColorStop(0.2, isHovered ? 'rgba(30, 36, 48, 0.95)' : 'rgba(18, 22, 30, 0.9)');
        grad.addColorStop(1, 'rgba(4, 5, 8, 0.98)');

        ctx.fillStyle = grad;

        if (p.relations.length >= 2) {
          const segmentAngle = (Math.PI * 2) / p.relations.length;
          for (let s = 0; s < p.relations.length; s++) {
            const relColor = getCategoryColor(p.relations[s]);
            ctx.strokeStyle = relColor;
            ctx.lineWidth = isHovered ? 3.5 : 2.0;
            ctx.beginPath();
            ctx.arc(p.screenX, p.screenY, radius, s * segmentAngle, (s + 1) * segmentAngle);
            ctx.stroke();
          }
        } else {
          const relColor = p.relations.length > 0 ? getCategoryColor(p.relations[0]) : '#9ca3af';
          ctx.strokeStyle = isHovered ? '#ffffff' : relColor;
          ctx.lineWidth = isHovered ? 2.5 : 1.5;
          ctx.beginPath();
          ctx.arc(p.screenX, p.screenY, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        ctx.fill();

        if (p.avatarConfig) {
          drawFigureCanvas(ctx, p.screenX, p.screenY, radius * 0.55, p.avatarConfig, globalAvatarStyle);
        } else {
          ctx.font = `${radius * 0.95}px Outfit`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.avatar, p.screenX, p.screenY);
        }

        ctx.font = isHovered ? 'bold 11px Outfit' : '10px Outfit';
        ctx.fillStyle = isHovered ? '#ffffff' : 'var(--text-secondary)';
        ctx.fillText(p.name.split(' ')[0], p.screenX, p.screenY + radius + 14);
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [visibleContacts, selectedContactId, activeFilter, spacing, layoutShape]);

  // Pointer projection utilities delegation
  const getCanvasContextParams = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const angleX = cameraRotationRef.current.x;
    const angleY = cameraRotationRef.current.y;
    const zoom = zoomRef.current;
    return { cx, cy, angleX, angleY, zoom, focalLength: 350 };
  };

  const getHoveredNodeAt = (clientX: number, clientY: number): PhysicsNode | null => {
    const params = getCanvasContextParams();
    const canvas = canvasRef.current;
    if (!params || !canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;

    const projected = getProjectedNodes(
      nodesRef.current,
      params.angleX,
      params.angleY,
      params.zoom,
      params.focalLength,
      params.cx,
      params.cy,
      selectedContactId
    );
    return findNodeAtCursor(projected, mx, my);
  };

  const getHoveredLinkAt = (clientX: number, clientY: number) => {
    const params = getCanvasContextParams();
    const canvas = canvasRef.current;
    if (!params || !canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;

    const projected = getProjectedNodes(
      nodesRef.current,
      params.angleX,
      params.angleY,
      params.zoom,
      params.focalLength,
      params.cx,
      params.cy,
      selectedContactId
    );
    return findLinkAtCursor(projected, mx, my, visibleContacts);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const active = getHoveredNodeAt(e.clientX, e.clientY);
    if (active) {
      const contactMatch = contacts.find(c => c.id === active.id);
      if (contactMatch) onSelectContact(contactMatch);

      if (active.id !== 'user-profile') {
        draggedNodeIdRef.current = active.id;
      }
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      e.currentTarget.setPointerCapture(e.pointerId);
    } else {
      const activeLink = getHoveredLinkAt(e.clientX, e.clientY);
      if (activeLink) {
        const c1 = contacts.find(c => c.id === activeLink.n1.id);
        const c2 = contacts.find(c => c.id === activeLink.n2.id);
        if (c1 && c2) onSelectLink(c1, c2);
      } else {
        isDraggingRef.current = true;
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        e.currentTarget.setPointerCapture(e.pointerId);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const params = getCanvasContextParams();
    if (!params) return;

    if (draggedNodeIdRef.current) {
      const node = nodesRef.current.find(n => n.id === draggedNodeIdRef.current);
      if (node) {
        const mx = e.clientX - dragStartRef.current.x;
        const my = e.clientY - dragStartRef.current.y;

        const delta = calculate3DDragDelta(
          mx,
          my,
          node.z,
          params.zoom,
          params.focalLength,
          params.angleX,
          params.angleY
        );

        node.x += delta.rx;
        node.y += delta.ry;
        node.z += delta.rz2;

        node.vx = 0;
        node.vy = 0;
        node.vz = 0;

        dragStartRef.current = { x: e.clientX, y: e.clientY };
      }
    } else if (isDraggingRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      
      cameraRotationRef.current.y += dx * 0.007;
      cameraRotationRef.current.x -= dy * 0.007;

      dragStartRef.current = { x: e.clientX, y: e.clientY };
    } else {
      const hovered = getHoveredNodeAt(e.clientX, e.clientY);
      if (hovered) {
        hoveredNodeIdRef.current = hovered.id;
        hoveredLinkIdRef.current = null;
        e.currentTarget.style.cursor = 'grab';
      } else {
        hoveredNodeIdRef.current = null;
        const hoveredLink = getHoveredLinkAt(e.clientX, e.clientY);
        if (hoveredLink) {
          hoveredLinkIdRef.current = `${hoveredLink.n1.id}-${hoveredLink.n2.id}`;
          e.currentTarget.style.cursor = 'pointer';
        } else {
          hoveredLinkIdRef.current = null;
          e.currentTarget.style.cursor = 'default';
        }
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (draggedNodeIdRef.current) {
      draggedNodeIdRef.current = null;
      e.currentTarget.releasePointerCapture(e.pointerId);
    } else if (isDraggingRef.current) {
      isDraggingRef.current = false;
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const node = getHoveredNodeAt(e.clientX, e.clientY);
    if (node) {
      const matched = contacts.find(c => c.id === node.id);
      if (matched) onRightClickNode(matched, e.clientX, e.clientY);
    } else {
      onRightClickCanvas(e.clientX, e.clientY);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const active = getHoveredNodeAt(e.clientX, e.clientY);
    if (active) {
      const contactMatch = contacts.find(c => c.id === active.id);
      if (contactMatch && onDoubleClickNode) {
        onDoubleClickNode(contactMatch);
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        style={{ display: 'block', outline: 'none', cursor: 'grab', width: '100%', height: '100%' }}
      />
      
      {/* Category filters HUD */}
      {effectiveExpanded && onFilterChange && (
        <div style={{ 
          position: 'absolute', 
          top: '16px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          display: 'flex', 
          gap: '8px', 
          zIndex: 5,
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '6px 12px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {[
            { key: 'All', label: t('filter_all'), color: 'rgba(255,255,255,0.2)' },
            { key: 'Friend', label: t('filter_friends'), color: getCategoryColor('Friend') },
            { key: 'Colleague', label: t('filter_colleagues'), color: getCategoryColor('Colleague') },
            { key: 'Family', label: t('filter_family'), color: getCategoryColor('Family') },
            { key: 'Mentor', label: t('filter_mentors'), color: getCategoryColor('Mentor') },
            ...customCategories.map(c => ({ key: c.key, label: c.label, color: c.color }))
          ].map(chip => (
            <button
              key={chip.key}
              onClick={() => onFilterChange(chip.key)}
              style={{
                backgroundColor: activeFilter === chip.key ? 'var(--bg-surface)' : 'transparent',
                border: '1px solid',
                borderColor: activeFilter === chip.key ? chip.color : 'var(--border-subtle)',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                fontSize: '10px',
                fontWeight: activeFilter === chip.key ? 700 : 500,
                padding: '3px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s',
                outline: 'none'
              }}
            >
              <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: chip.color, marginRight: '5px' }} />
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {/* Shapes controller */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '6px', zIndex: 5 }}>
        {['sphere', 'torus', 'spiral', 'dna'].map((shape) => (
          <button
            key={shape}
            onClick={() => setLayoutShape(shape as any)}
            style={{
              backgroundColor: layoutShape === shape ? 'rgba(20, 184, 166, 0.25)' : 'rgba(0, 0, 0, 0.4)',
              border: layoutShape === shape ? '1px solid var(--accent-teal)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '10px',
              padding: '4px 8px',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontWeight: 600
            }}
          >
            {t('layout_' + shape)}
          </button>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: '16px', left: '16px', display: 'flex', gap: '8px', zIndex: 5 }}>
        <button 
          onClick={() => { zoomRef.current = Math.min(2.0, zoomRef.current + 0.15); }}
          style={styles.controlBtn}
        >
          ➕
        </button>
        <button 
          onClick={() => { zoomRef.current = Math.max(0.5, zoomRef.current - 0.15); }}
          style={styles.controlBtn}
        >
          ➖
        </button>
        <button 
          onClick={() => { cameraRotationRef.current = { x: 0.1, y: 0.2 }; zoomRef.current = 1.0; }}
          style={styles.controlBtn}
        >
          🔄 Recenter
        </button>
      </div>

      {/* Toggle View */}
      <button
        onClick={handleToggleFullscreen}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '6px',
          color: '#fff',
          fontSize: '11px',
          padding: '4px 8px',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        {effectiveExpanded ? t('fullscreen_close') : t('fullscreen_open')}
      </button>
      
      <div style={{ position: 'absolute', top: '20px', right: '140px', pointerEvents: 'none', opacity: 0.5, fontSize: '10px', color: 'var(--text-secondary)' }}>
        {t('fullscreen_hint')}
      </div>

      {/* Spacing Slider Control */}
      <div style={{ 
        position: 'absolute', 
        bottom: '16px', 
        right: '16px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '6px', 
        zIndex: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        minWidth: '160px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            ↔️ {t('spacing_label') || 'Écartement'}
          </span>
          <span style={{ fontSize: '10px', color: '#fff', fontWeight: 'bold' }}>
            {spacing.toFixed(1)}x
          </span>
        </div>
        <input 
          type="range"
          min="0.5"
          max="3.0"
          step="0.1"
          value={spacing}
          onChange={(e) => setSpacing(parseFloat(e.target.value))}
          style={{
            width: '100%',
            accentColor: 'var(--accent-teal)',
            cursor: 'pointer',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            outline: 'none'
          }}
        />
      </div>
    </div>
  );
}
