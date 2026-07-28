import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { createLeadSchema, CreateLeadFormData } from '@/utils/validators/lead.schemas';
import { LeadService } from '@/services/lead.service';
import toast from 'react-hot-toast';

export interface ManualLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ManualLeadModal: React.FC<ManualLeadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLeadFormData>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      source: 'MANUAL_ENTRY',
      notes: '',
    },
  });

  const onSubmit: SubmitHandler<CreateLeadFormData> = async (data) => {
    setIsLoading(true);
    try {
      await LeadService.createLead(data);
      toast.success('Lead added successfully!');
      reset();
      onSuccess();
      onClose();
    } catch {
      toast.error('Failed to create lead.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Manual Lead">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Full Name" placeholder="e.g. Rahul Sharma" error={errors.name?.message} {...register('name')} />
        <Input label="Phone Number" placeholder="+91 98765 43210" error={errors.phone?.message} {...register('phone')} />
        <Input label="Email Address" type="email" placeholder="rahul@example.com" error={errors.email?.message} {...register('email')} />

        <Select
          label="Lead Source"
          options={[
            { label: 'Manual Entry', value: 'MANUAL_ENTRY' },
            { label: 'Facebook Ads', value: 'FACEBOOK_ADS' },
            { label: 'Instagram Ads', value: 'INSTAGRAM_ADS' },
            { label: 'Google Ads', value: 'GOOGLE_ADS' },
            { label: 'Website Form', value: 'WEBSITE_FORM' },
          ]}
          error={errors.source?.message}
          {...register('source')}
        />

        <div className="form-group">
          <label className="form-label">Initial Notes</label>
          <textarea className="textarea" rows={3} placeholder="Customer preferences..." {...register('notes')} />
        </div>

        <div className="lead-actions-right modal-footer-top">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Add Lead
          </Button>
        </div>
      </form>
    </Modal>
  );
};
