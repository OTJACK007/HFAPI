import React from 'react';
import { Card, CardBody, CardHeader, Button, Divider, Input, Select, SelectItem } from "@nextui-org/react";
import { Palette, RefreshCw } from 'lucide-react';
import { useThemeContext } from '../contexts/ThemeContext';

interface ThemeDisplayProps {
  themeType: 'kyc' | 'kyb';
}

export const ThemeDisplay: React.FC<ThemeDisplayProps> = ({ themeType }) => {
  const { kycTheme, kybTheme, setKYCTheme, setKYBTheme, resetKYCTheme, resetKYBTheme, applyKYCTheme, applyKYBTheme } = useThemeContext();
  
  const theme = themeType === 'kyc' ? kycTheme : kybTheme;
  const setTheme = themeType === 'kyc' ? setKYCTheme : setKYBTheme;
  const resetTheme = themeType === 'kyc' ? resetKYCTheme : resetKYBTheme;
  const applyTheme = themeType === 'kyc' ? applyKYCTheme : applyKYBTheme;
  
  const presetThemes = themeType === 'kyc' 
    ? [
        { value: 'default', label: 'Par défaut (Rose/Vert)' },
        { value: 'blue', label: 'Bleu' },
        { value: 'light', label: 'Mode clair' }
      ]
    : [
        { value: 'default', label: 'Par défaut (Rose/Vert)' },
        { value: 'enterprise', label: 'Entreprise (Indigo/Emeraude)' },
        { value: 'light', label: 'Mode clair' }
      ];

  const handleColorChange = (colorKey: string, value: string) => {
    setTheme({
      colors: {
        [colorKey]: value
      }
    });
    
    // Si on change la couleur primaire, mettre à jour également la couleur du bouton
    // à moins que celle-ci ait été personnalisée
    if (colorKey === 'primary' && theme.colors.buttonColor === theme.colors.primary) {
      setTheme({
        colors: {
          buttonColor: value
        }
      });
    }
    
    // Mettre à jour les effets basés sur la couleur primaire
    if (colorKey === 'primary') {
      setTheme({
        effects: {
          backgroundGradient: {
            fromColor: value
          },
          glow: {
            color: value
          },
          animations: {
            glow: {
              fromColor: value
            }
          }
        }
      });
    }
  };

  return (
    <Card className="max-w-md bg-background/40 border border-white/10">
      <CardHeader className="flex flex-col items-start pb-0">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">
            Personnalisation du thème {themeType.toUpperCase()}
          </h3>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Preset Themes */}
        <div className="space-y-2">
          <label className="text-sm text-white/80">Thèmes prédéfinis</label>
          <Select
            size="sm"
            items={presetThemes}
            placeholder="Sélectionner un thème"
            onChange={(e) => applyTheme(e.target.value)}
            className="max-w-full"
          >
            {(item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            )}
          </Select>
        </div>
        
        <Divider className="my-2" />
        
        {/* Color Controls */}
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm text-white/80">Couleur primaire</label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={theme.colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-12 h-8 p-0 min-h-0"
              />
              <Input
                type="text"
                value={theme.colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                size="sm"
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-white/80">Couleur des boutons</label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={theme.colors.buttonColor}
                onChange={(e) => handleColorChange('buttonColor', e.target.value)}
                className="w-12 h-8 p-0 min-h-0"
              />
              <Input
                type="text"
                value={theme.colors.buttonColor}
                onChange={(e) => handleColorChange('buttonColor', e.target.value)}
                size="sm"
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-white/80">Couleur secondaire</label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={theme.colors.secondary || '#2eff94'}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-12 h-8 p-0 min-h-0"
              />
              <Input
                type="text"
                value={theme.colors.secondary || '#2eff94'}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                size="sm"
                className="flex-1"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <Button 
            color="secondary"
            variant="flat"
            size="sm"
            onClick={resetTheme}
            startContent={<RefreshCw className="w-4 h-4" />}
            className="w-full"
          >
            Réinitialiser le thème
          </Button>
        </div>
        
        {/* Preview */}
        <div className="space-y-2 pt-2">
          <label className="text-sm text-white/80">Aperçu</label>
          <div className="p-4 border border-white/10 rounded-lg space-y-3">
            <h4 className="text-sm font-semibold">Éléments du thème</h4>
            <div className="flex gap-2">
              <Button color="primary" size="sm">Bouton primaire</Button>
              <Button variant="bordered" size="sm">Bouton secondaire</Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
              <span className="text-xs">Couleur primaire</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.secondary }}></div>
              <span className="text-xs">Couleur secondaire</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};