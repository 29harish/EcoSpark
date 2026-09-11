import { useState } from 'react';
import { Camera, MapPin, Calendar, Upload, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

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
  const [photoName, setPhotoName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!treeName || !plantLocation || !plantDate || !photoName) {
      return;
    }

    setSubmitted(true);
    onSubmitted?.();
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

        {/* Tree name */}
        <input
          type="text"
          placeholder="Tree / Sapling Name"
          value={treeName}
          onChange={(e) => setTreeName(e.target.value)}
          className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-leaf-300"
        />

        {/* Location */}
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

        {/* Date */}
        <div className="relative">
          <Calendar className="absolute left-3 top-3 w-4 h-4 text-leaf-500" />

          <input
            type="date"
            value={plantDate}
            onChange={(e) => setPlantDate(e.target.value)}
            className="w-full rounded-xl border border-leaf-200 bg-white pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-leaf-300"
          />
        </div>

        {/* Photo */}
        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-leaf-200 rounded-xl px-4 py-4 bg-white cursor-pointer hover:bg-leaf-50 transition">
          <Upload className="w-5 h-5 text-leaf-500" />

          <span className="text-sm font-medium text-leaf-700">
            {photoName || 'Upload Photo Proof'}
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                setPhotoName(file.name);
              }
            }}
          />
        </label>

        {/* Reward */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <Badge variant="green" size="sm">
            ⭐ {xpReward} XP
          </Badge>

          <Badge variant="gold" size="sm">
            🪙 {coinReward} Coins
          </Badge>
        </div>

        {/* Submit */}
        <Button
          fullWidth
          disabled={!treeName || !plantLocation || !plantDate || !photoName}
          onClick={handleSubmit}
        >
          Submit for Verification
        </Button>

      </div>
    </div>
  );
        }
