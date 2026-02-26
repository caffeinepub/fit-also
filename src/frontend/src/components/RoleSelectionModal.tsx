import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LuxuryButton } from './LuxuryButton';
import { useLanguage } from '../hooks/useLanguage';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import type { LocalUserProfile } from '../hooks/useQueries';
import { User, Scissors, ShieldCheck, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface RoleSelectionModalProps {
  open: boolean;
  onClose?: () => void;
}

type Step = 'role' | 'profile';

export function RoleSelectionModal({ open, onClose }: RoleSelectionModalProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const saveProfile = useSaveCallerUserProfile();
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<LocalUserProfile['role']>('customer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const handleRoleSelect = (r: LocalUserProfile['role']) => {
    setRole(r);
    setStep('profile');
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    
    try {
      const profileData: LocalUserProfile = { 
        name, 
        phone, 
        city, 
        preferredLanguage: lang, 
        role 
      };
      
      // Save to backend
      await saveProfile.mutateAsync(profileData);
      
      // Also save to localStorage as backup
      if (identity) {
        const principal = identity.getPrincipal().toString();
        localStorage.setItem(`userProfile_${principal}`, JSON.stringify(profileData));
        
        // Store email for admin check if provided
        if (phone.includes('@')) {
          localStorage.setItem('userEmail', phone);
        }
      }
      
      toast.success('Profile saved successfully!');
      
      // Close modal and navigate to home
      if (onClose) onClose();
      navigate({ to: '/' });
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile. Please try again.');
    }
  };

  const roles = [
    { id: 'customer' as const, label: t('auth.customer'), icon: User, desc: 'Browse and order custom garments' },
    { id: 'tailor' as const, label: t('auth.tailor'), icon: Scissors, desc: 'List your services and manage orders' },
    { id: 'admin' as const, label: t('auth.admin'), icon: ShieldCheck, desc: 'Manage the platform' },
  ];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md" onInteractOutside={e => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="font-serif text-2xl">
                {step === 'role' ? t('auth.selectRole') : t('auth.completeProfile')}
              </DialogTitle>
              <DialogDescription>
                {step === 'role' ? 'Choose how you want to use Fit Also' : 'Tell us a bit about yourself'}
              </DialogDescription>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={handleClose} className="shrink-0">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        {step === 'role' ? (
          <div className="grid gap-3 py-2 max-h-[60vh] overflow-y-auto" style={{ scrollMarginBottom: '200px' }}>
            {roles.map(({ id, label, icon: Icon, desc }) => (
              <button
                key={id}
                onClick={() => handleRoleSelect(id)}
                className="flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-muted transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{label}</div>
                  <div className="text-sm text-muted-foreground">{desc}</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pb-[300px]" style={{ scrollMarginBottom: '200px' }}>
            <div className="grid gap-1.5" style={{ scrollMarginBottom: '200px' }}>
              <Label htmlFor="name">{t('auth.name')} *</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Your full name"
                onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              />
            </div>
            <div className="grid gap-1.5" style={{ scrollMarginBottom: '200px' }}>
              <Label htmlFor="phone">{t('auth.phone')}</Label>
              <Input 
                id="phone" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="+91 98765 43210"
                onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              />
            </div>
            <div className="grid gap-1.5" style={{ scrollMarginBottom: '200px' }}>
              <Label htmlFor="city">{t('tailor.city')}</Label>
              <Input 
                id="city" 
                value={city} 
                onChange={e => setCity(e.target.value)} 
                placeholder="Mumbai, Delhi..."
                onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              />
            </div>
            <div className="grid gap-1.5" style={{ scrollMarginBottom: '200px' }}>
              <Label>{t('auth.language')}</Label>
              <Select value={lang} onValueChange={v => setLang(v as 'en' | 'hi')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-2">
              <LuxuryButton variant="ghost" size="sm" onClick={() => setStep('role')}>
                {t('common.back')}
              </LuxuryButton>
              <LuxuryButton
                variant="primary"
                size="md"
                className="flex-1"
                onClick={handleSave}
                loading={saveProfile.isPending}
                disabled={!name.trim()}
              >
                {saveProfile.isPending ? 'Saving...' : t('auth.save')}
              </LuxuryButton>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
