import { useState } from 'react';
import {
  Camera,
  MapPin,
  Calendar,
  Upload,
  CheckCircle2,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { auth, db, storage } from '@/lib/firebase';

import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

interface PlantTreeMissionProps {
  xpReward: number;
  coinReward: number;
  onSubmitted?: () => void;
}

export function PlantTreeMission({
  xpReward,
  coinReward,
  onSubmitted,
}: PlantTreeMissionProps) {
  const [treeName, setTreeName] = useState('');
  const [plantLocation, setPlantLocation] = useState('');
  const [plantDate, setPlantDate] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const user = auth.currentUser;

    if (!user) {
      setError('Please log in before submitting the mission.');
      return;
    }

    if (!treeName || !plantLocation || !plantDate || !photo) {
      setError('Please complete all fields and upload a photo.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      // Create a unique Firestore submission ID
      const submissionRef = doc(collection(db, 'tree_submissions'));
      const submissionId = submissionRef.id;

      // Upload the actual photo to Firebase Storage
      const photoRef = ref(
        storage,
        `tree-proofs/${user.uid}/${submissionId}-${photo.name}`
      );

      await uploadBytes(photoRef, photo);

      // Get the URL of the uploaded photo
      const photoUrl = await getDownloadURL(photoRef);

      // Save submission information in Firestore
      await setDoc(submissionRef, {
        studentId: user.uid,
        studentName: user.displayName || 'Student',
        studentEmail: user.email || '',

        treeName,
        location: plantLocation,
        plantingDate: plantDate,

        photoUrl,

        status: 'pending',

        createdAt: serverTimestamp(),

        reviewedAt: null,
        reviewedBy: null,
        rejectionReason: '',
      });

      setSubmitted(true);
      onSubmitted?.();
    } catch (err) {
      console.error('Tree submission error:', err);
      setError('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-5 rounded-3xl bg-sun-50 border border-sun-200 p-5 text-center">
        <CheckCircle2 className="w-10 h-10 text-leaf-500 mx-auto mb-2" />

        <h4 className="text-lg font-extrabold text-leaf-800">
          Proof Submitted!
        </h4>

        <p className="text-sm text-leaf-600/70 mt-1">
          Your tree planting proof is now waiting for verification.
        </p>

        <div className="mt-3">
          <Badge variant="gold" size="sm">
            ⏳ Pending Verification
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 p-5 rounded-3xl bg-leaf-50 border border-leaf-100">
      <div className="flex items-center gap-2 mb-1">
        <Camera className="w-5 h-5 text-leaf-600" />

        <h4 className="text-lg font-extrabold text-leaf-800">
          Plant a Sapling
        </h4>
      </div>

      <p className="text-sm text-leaf-600/70 mb-4">
        Plant a real sapling and submit proof of your work.
      </p>

      <div className="space-y-3">

        <input
          type="text"
          placeholder="Tree / Sapling Name"
          value={treeName}
          onChange={(e) => setTreeName(e.target.value)}
          className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-leaf-300"
        />

        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-4 h-4 text-leaf-500" />

          <input
            type="text"
            placeholder="Planting Location"
            value={plantLocation}
            onChange={(e) => setPlantLocation(e.target.value)}
            className="w-full rounded-xl border border-leaf-200 bg-white pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-leaf-300"
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-3 w-4 h-4 text-leaf-500" />

          <input
            type="date"
            value={plantDate}
            onChange={(e) => setPlantDate(e.target.value)}
            className="w-full rounded-xl border border-leaf-200 bg-white pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-leaf-300"
          />
        </div>

        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-leaf-200 rounded-xl px-4 py-4 bg-white cursor-pointer hover:bg-leaf-50 transition">
          <Upload className="w-5 h-5 text-leaf-500" />

          <span className="text-sm font-medium text-leaf-700">
            {photo ? photo.name : 'Upload Photo Proof'}
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                setPhoto(file);
                setError('');
              }
            }}
          />
        </label>

        <div className="flex items-center justify-center gap-2 pt-1">
          <Badge variant="green" size="sm">
            ⭐ {xpReward} XP
          </Badge>

          <Badge variant="gold" size="sm">
            🪙 {coinReward} Coins
          </Badge>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">
            {error}
          </p>
        )}

        <Button
          fullWidth
          disabled={
            submitting ||
            !treeName ||
            !plantLocation ||
            !plantDate ||
            !photo
          }
          onClick={handleSubmit}
        >
          {submitting ? 'Submitting...' : 'Submit for Verification'}
        </Button>

      </div>
    </div>
  );
          }
