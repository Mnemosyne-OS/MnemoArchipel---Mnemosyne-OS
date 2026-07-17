import React, { useState } from 'react';
import { Contact, Pet } from '../../types';
import { styles } from '../../styles';

interface PetsWidgetProps {
  selectedContact: Contact;
  handleUpdateContact: (c: Contact) => void;
  t: (key: string) => string;
  inputStyle: any;
  btnStyle: any;
}

export const PetsWidget: React.FC<PetsWidgetProps> = ({
  selectedContact,
  handleUpdateContact,
  t,
  inputStyle,
  btnStyle
}) => {
  const [newPet, setNewPet] = useState<Omit<Pet, 'id'>>({ name: '', type: '', age: '', breed: '' });

  const petsList = selectedContact.pets || [];

  const addPet = () => {
    if (!newPet.name || !newPet.type) return;
    const pets = [...petsList, newPet];
    handleUpdateContact({ ...selectedContact, pets });
    setNewPet({ name: '', type: '', age: '', breed: '' });
  };

  const removePet = (idx: number) => {
    const pets = petsList.filter((_, i) => i !== idx);
    handleUpdateContact({ ...selectedContact, pets });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {petsList.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {petsList.map((pet, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-deep)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>🐾 {pet.name} ({pet.type})</span>
                {(pet.age || pet.breed) && (
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {pet.age ? `${pet.age} • ` : ''}{pet.breed || ''}
                  </span>
                )}
              </div>
              <button onClick={() => removePet(idx)} style={{ background: 'transparent', border: 'none', color: 'rgba(239, 68, 68, 0.6)', cursor: 'pointer', fontSize: '11px', outline: 'none' }} title="Delete">✕</button>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.emptyText}>{t('sidebar_empty_pets')}</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <input 
            type="text" 
            placeholder={t('pet_name_placeholder')} 
            value={newPet.name} 
            onChange={e => setNewPet({ ...newPet, name: e.target.value })} 
            style={inputStyle}
          />
          <input 
            type="text" 
            placeholder={t('pet_type_placeholder')} 
            value={newPet.type} 
            onChange={e => setNewPet({ ...newPet, type: e.target.value })} 
            style={inputStyle}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <input 
            type="text" 
            placeholder={t('pet_age_placeholder')} 
            value={newPet.age} 
            onChange={e => setNewPet({ ...newPet, age: e.target.value })} 
            style={inputStyle}
          />
          <input 
            type="text" 
            placeholder={t('pet_breed_placeholder')} 
            value={newPet.breed} 
            onChange={e => setNewPet({ ...newPet, breed: e.target.value })} 
            style={inputStyle}
          />
        </div>
        <button type="button" onClick={addPet} style={btnStyle}>{t('btn_add_pet')}</button>
      </div>
    </div>
  );
};
