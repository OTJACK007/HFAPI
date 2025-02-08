import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { User, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useKYC } from '../KYCContext'; 
import { supabase } from '../../../lib/supabase';

const ViewEditCustomerData = () => {
  const { theme } = useTheme();
  const { session } = useKYC();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    documentType: '',
    documentNumber: ''
  });

  useEffect(() => {
    if (session) {
      // Get temp data if exists
      const getTempData = async () => {
        const { data, error } = await supabase
          .from('kyc_temp_data')
          .select('form_data')
          .eq('session_id', session.id)
          .single();

        if (data?.form_data) {
          setFormData({
            firstName: data.form_data.firstName || '',
            lastName: data.form_data.lastName || '',
            email: session.customer_email,
            phone: data.form_data.phone || '',
            address: data.form_data.address || '',
            city: data.form_data.city || '',
            country: data.form_data.country || '',
            documentType: data.form_data.documentType || '',
            documentNumber: data.form_data.documentNumber || ''
          });
        } else {
          // Initialize with session data
          const [firstName, lastName] = session.customer_name.split(' ');
          setFormData(prev => ({
            ...prev,
            firstName: firstName || '',
            lastName: lastName || '',
            email: session.customer_email
          }));
        }
      };

      getTempData();
    }
  }, [session]);
  const handleSave = async () => {
    try {
      if (!session) {
        throw new Error('No active session');
      }

      // Store form data temporarily
      const { error } = await supabase
        .from('kyc_temp_data')
        .upsert({
          session_id: session.id,
          form_data: formData,
          document_urls: []
        });

      if (error) throw error;
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating customer data:', error);
      alert('Failed to update customer data');
    }
  };

  return (
    <div className="space-y-6">
      <Card className={`${
        theme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700/50' 
          : 'bg-white border-gray-200'
      } border`}>
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className={`text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Personal Information</h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Manage customer details
                </p>
              </div>
            </div>
            <Button
              color={isEditing ? "success" : "primary"}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? 'Save Changes' : 'Edit'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              startContent={<User className="w-4 h-4 text-gray-400" />}
              isDisabled={!isEditing}
              classNames={{
                input: `${theme === 'dark' ? 'bg-gray-700/50 text-white' : 'bg-gray-100 text-gray-900'}`,
                inputWrapper: `${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-100 border-gray-300'}`
              }}
            />

            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              startContent={<User className="w-4 h-4 text-gray-400" />}
              isDisabled={!isEditing}
              classNames={{
                input: `${theme === 'dark' ? 'bg-gray-700/50 text-white' : 'bg-gray-100 text-gray-900'}`,
                inputWrapper: `${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-100 border-gray-300'}`
              }}
            />

            <Input
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              startContent={<Mail className="w-4 h-4 text-gray-400" />}
              isDisabled={!isEditing}
              classNames={{
                input: `${theme === 'dark' ? 'bg-gray-700/50 text-white' : 'bg-gray-100 text-gray-900'}`,
                inputWrapper: `${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-100 border-gray-300'}`
              }}
            />

            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              startContent={<Phone className="w-4 h-4 text-gray-400" />}
              isDisabled={!isEditing}
              classNames={{
                input: `${theme === 'dark' ? 'bg-gray-700/50 text-white' : 'bg-gray-100 text-gray-900'}`,
                inputWrapper: `${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-100 border-gray-300'}`
              }}
            />

            <Input
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              startContent={<MapPin className="w-4 h-4 text-gray-400" />}
              isDisabled={!isEditing}
              classNames={{
                input: `${theme === 'dark' ? 'bg-gray-700/50 text-white' : 'bg-gray-100 text-gray-900'}`,
                inputWrapper: `${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-100 border-gray-300'}`
              }}
            />

            <Input
              label="City"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              startContent={<Building2 className="w-4 h-4 text-gray-400" />}
              isDisabled={!isEditing}
              classNames={{
                input: `${theme === 'dark' ? 'bg-gray-700/50 text-white' : 'bg-gray-100 text-gray-900'}`,
                inputWrapper: `${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-100 border-gray-300'}`
              }}
            />

            <Select
              label="Document Type"
              value={formData.documentType}
              onChange={(e) => setFormData(prev => ({ ...prev, documentType: e.target.value }))}
              isDisabled={!isEditing}
              classNames={{
                trigger: `${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-100 border-gray-300'}`,
                value: theme === 'dark' ? 'text-white' : 'text-gray-900'
              }}
            >
              <SelectItem key="passport" value="passport">Passport</SelectItem>
              <SelectItem key="drivers_license" value="drivers_license">Driver's License</SelectItem>
              <SelectItem key="national_id" value="national_id">National ID</SelectItem>
            </Select>

            <Input
              label="Document Number"
              value={formData.documentNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, documentNumber: e.target.value }))}
              isDisabled={!isEditing}
              classNames={{
                input: `${theme === 'dark' ? 'bg-gray-700/50 text-white' : 'bg-gray-100 text-gray-900'}`,
                inputWrapper: `${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-100 border-gray-300'}`
              }}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ViewEditCustomerData;