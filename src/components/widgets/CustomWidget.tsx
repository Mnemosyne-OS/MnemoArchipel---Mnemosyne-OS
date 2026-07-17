import React from 'react';
import { Contact, CustomWidgetDef, CustomWidgetField } from '../../types';

interface CustomWidgetProps {
  selectedContact: Contact;
  widgetId: string;
  customWidgetDefs: CustomWidgetDef[];
  handleUpdateContact: (c: Contact) => void;
  inputStyle: any;
}

export const CustomWidget: React.FC<CustomWidgetProps> = ({
  selectedContact,
  widgetId,
  customWidgetDefs,
  handleUpdateContact,
  inputStyle
}) => {
  const widgetDef = customWidgetDefs.find(w => w.id === widgetId);
  if (!widgetDef) return null;

  const currentData = selectedContact.customWidgetData?.[widgetId] || {};

  const handleFieldChange = (fieldKey: string, val: string | number | boolean) => {
    const customWidgetData = { ...selectedContact.customWidgetData };
    customWidgetData[widgetId] = {
      ...currentData,
      [fieldKey]: val
    };
    handleUpdateContact({
      ...selectedContact,
      customWidgetData
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {widgetDef.fields.map((field: CustomWidgetField) => {
        const val = currentData[field.key];
        return (
          <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{field.label}</span>
            {field.type === 'boolean' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '2px 0' }}>
                <input 
                  type="checkbox" 
                  checked={!!val} 
                  onChange={e => handleFieldChange(field.key, e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{field.label}</span>
              </div>
            ) : field.type === 'number' ? (
              <input 
                type="number" 
                value={val !== undefined ? String(val) : ''} 
                onChange={e => handleFieldChange(field.key, parseFloat(e.target.value) || 0)} 
                style={inputStyle}
              />
            ) : (
              <input 
                type="text" 
                value={val !== undefined ? String(val) : ''} 
                onChange={e => handleFieldChange(field.key, e.target.value)} 
                style={inputStyle}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
