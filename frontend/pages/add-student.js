import { useRouter } from 'next/router';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

const StudentSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone is required'),
  studentId: Yup.string().required('Student ID is required'),
  address: Yup.string().required('Address is required'),
  subjects: Yup.string().required('At least one subject is required'),
});

export default function AddStudent() {
  const router = useRouter();
  const [preview, setPreview] = useState(null);
  const [apiError, setApiError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const hiddenFileInputRef = useRef(null);

  // Trigger hidden file input on container or button click
  const handleClick = () => {
    hiddenFileInputRef.current.click();
  };

  // Handle file selection via browse dialog
  const handleFileChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue('image', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ----- DRAG & DROP HANDLERS -----
  const handleDragOver = (e) => {
    e.preventDefault(); // Required to allow drop
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e, setFieldValue) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFieldValue('image', file);
      setPreview(URL.createObjectURL(file));
    }
  };
  // --------------------------------

  const handleSubmit = async (values, { setSubmitting }) => {
    setApiError('');
    try {
      // Convert comma-separated subjects to array
      const subjectsArray = values.subjects.split(',').map((sub) => sub.trim());

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('studentId', values.studentId);
      formData.append('address', values.address);
      formData.append('subjects', JSON.stringify(subjectsArray));
      if (values.image) {
        formData.append('image', values.image);
      }

      const res = await fetch('https://student-record-api.vercel.app/students', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        router.push('/');
      } else {
        const errorData = await res.json();
        setApiError(errorData.error || 'Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      setApiError('Error adding student');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-2xl p-10 w-full max-w-lg">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Add Student
        </h1>
        {apiError && <p className="text-red-600 text-center mb-4">{apiError}</p>}
        <Formik
          initialValues={{
            name: '',
            email: '',
            phone: '',
            studentId: '',
            address: '',
            subjects: '',
            image: null,
          }}
          validationSchema={StudentSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                  Name
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter full name"
                  className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 mt-1" />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 mt-1" />
              </div>

              {/* Phone & Student ID */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
                    Phone
                  </label>
                  <Field
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="e.g. 1234567890"
                    className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-500 mt-1" />
                </div>
                <div>
                  <label htmlFor="studentId" className="block text-gray-700 font-semibold mb-2">
                    Student ID
                  </label>
                  <Field
                    id="studentId"
                    name="studentId"
                    type="text"
                    placeholder="e.g. STU001"
                    className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="studentId" component="div" className="text-red-500 mt-1" />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-gray-700 font-semibold mb-2">
                  Address
                </label>
                <Field
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Enter address"
                  className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="address" component="div" className="text-red-500 mt-1" />
              </div>

              {/* Subjects */}
              <div>
                <label htmlFor="subjects" className="block text-gray-700 font-semibold mb-2">
                  Subjects (comma separated)
                </label>
                <Field
                  id="subjects"
                  name="subjects"
                  type="text"
                  placeholder="e.g. Math, Science"
                  className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="subjects" component="div" className="text-red-500 mt-1" />
              </div>

              {/* Drag-and-Drop Style Image Upload */}
              <div>
                <label htmlFor="image" className="block text-gray-700 font-semibold mb-2">
                  Student's Photo
                </label>
                <div
                  // Real Drag-and-Drop event handlers
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, setFieldValue)}
                  onClick={handleClick}
                  className={`border-2 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
                    ${
                      isDragging
                        ? 'border-purple-500 bg-purple-50 border-dashed'
                        : 'border-gray-300 border-dashed'
                    }
                  `}
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="mb-2 w-32 h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faImage} className="text-purple-400 text-3xl mb-2" />
                      <p className="text-gray-600">
                        Drag and drop image here, or click add image
                      </p>
                    </>
                  )}
                  <button
                    type="button"
                    className="mt-3 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full"
                  >
                    Add Image
                  </button>
                </div>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  ref={hiddenFileInputRef}
                  onChange={(e) => handleFileChange(e, setFieldValue)}
                  className="hidden"
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Add Student'}
                </button>
                <Link
                  href="/"
                  className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-center transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
