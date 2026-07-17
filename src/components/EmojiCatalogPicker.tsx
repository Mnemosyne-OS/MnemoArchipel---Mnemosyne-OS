import { useState } from 'react';

const EMOJI_CATEGORIES = [
  {
    name: 'Visages & Personnes',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', 
      '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
      '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸',
      '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️',
      '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡',
      '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓',
      '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄',
      '😬', '🤥', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😵',
      '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '🤖', '👽', '💀',
      '👻', '💩', '🤡', '👹', '👺', '🎃', '🧙', '🧚', '🧛', '🧜'
    ]
  },
  {
    name: 'Animaux & Nature',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', 
      '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒',
      '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇',
      '🐺', '🐗', '🐴', '🦄', '🐝', '🪱', '🐛', '🦋', '🐌', '🐞',
      '🐜', '🦟', '🦗', '🕷', '🕸', '🦂', '🐢', '🐍', '🦎', '🦖',
      '🦕', '🐙', '🦑', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳',
      '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🦣', '🐘',
      '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄',
      '🌸', '🌹', '🌺', '🌻', '🌼', '🌷', '🌱', '🪴', '🌲', '🌳',
      '🌴', '🌵', '🌾', '🍀', '🍁', '🍂', '🍃', '🍄', '🪵', '🐚'
    ]
  },
  {
    name: 'Nourriture & Boissons',
    emojis: [
      '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', 
      '🍉', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑',
      '🥦', '🥬', '🥒', '🌶', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅',
      '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳',
      '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟',
      '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🍿',
      '🍣', '🍱', '🥟', '🍤', '🍙', '🍚', '🍜', '🍝', '🍢', '🍡',
      '🍧', '🍨', '🍦', '🍰', '🎂', '🧁', '🥧', '🍫', '🍬', '🍭',
      '🍩', '🍪', '🍯', '🧂', '🥛', '☕', '🫖', '🍵', '🥤', '🧃',
      '🧉', '🥤', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🍾'
    ]
  },
  {
    name: 'Activités, Symboles & Objets',
    emojis: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', 
      '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏹', '🎣', '🤿', '🥊',
      '🥋', '🥅', '⛳', '⛸', '🎣', '🎽', '🎿', '🛷', '🥌', '🎯',
      '🎮', '🕹', '🎰', '🎨', '🎨', '🖌', '🖍', '🎸', '🎺', '🎻',
      '🎹', '🎤', '🎧', '🎬', '🎤', '🎪', '🎭', '🎫', '🎟', '🎗',
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💖',
      '🌟', '⭐️', '🔥', '💥', '✨', '⚡️', '☄️', '💫', '🌈', '☀️',
      '🌙', '🔮', '🧿', '💎', '🔑', '💡', '🛡️', '⚔️', '👑', '🎓',
      '💼', '📚', '🎒', '🌍', '🏠', '🎁', '🎉', '🎈', '⚙️', '🔍'
    ]
  }
];

interface EmojiCatalogPickerProps {
  onSelectEmoji: (emoji: string) => void;
}

export function EmojiCatalogPicker({ onSelectEmoji }: EmojiCatalogPickerProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const filteredCategories = EMOJI_CATEGORIES.map(cat => {
    if (!search.trim()) return cat;
    const cleanSearch = search.trim();
    return {
      ...cat,
      emojis: cat.emojis.filter(e => e.includes(cleanSearch))
    };
  }).filter(cat => cat.emojis.length > 0);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.01)',
      borderRadius: '12px'
    }}>
      {/* Search Input */}
      <input 
        type="text"
        placeholder="Rechercher un emoji (ex: 🐱, 🔥)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '8px',
          padding: '6px 10px',
          color: '#fff',
          fontSize: '11px',
          outline: 'none',
          transition: 'all 0.2s'
        }}
      />

      {/* Tabs */}
      {!search.trim() && (
        <div style={{
          display: 'flex',
          gap: '4px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          paddingBottom: '4px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {EMOJI_CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTab(idx)}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === idx ? 'var(--accent-teal)' : '#6b7280',
                fontSize: '10px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                padding: '4px 6px',
                borderBottom: activeTab === idx ? '2px solid var(--accent-teal)' : 'none'
              }}
            >
              {cat.name.split(' ')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Emoji Grid */}
      <div style={{
        maxHeight: '180px',
        overflowY: 'auto',
        paddingRight: '4px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {search.trim() ? (
          filteredCategories.map((cat, catIdx) => (
            <div key={catIdx}>
              <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 600, marginBottom: '4px' }}>{cat.name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px' }}>
                {cat.emojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectEmoji(emoji)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '6px',
                      fontSize: '18px',
                      aspectRatio: '1 / 1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px' }}>
              {EMOJI_CATEGORIES[activeTab]?.emojis.map((emoji, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectEmoji(emoji)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '6px',
                    fontSize: '18px',
                    aspectRatio: '1 / 1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
