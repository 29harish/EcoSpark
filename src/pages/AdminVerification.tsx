import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, MapPin, Calendar, User } from 'lucide-react';

import { db } from '@/lib/firebase';

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

interface TreeSubmission {
  id: string;
  studentName: string;
  studentEmail: string;
  treeName: string;
  location: string;
  plantingDate: string;
  photoUrl: string;
  status: string;
}

export function AdminVerification() {
  const [submissions, setSubmissions] = useState<TreeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError('');

      const q = query(
        collection(db, 'tree_submissions'),
        where('status', '==', 'pending')
      );

      const snapshot = await getDocs(q);

      const data: TreeSubmission[] = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as TreeSubmission[];

      setSubmissions(data);
    } catch (err) {
      console.error('Error loading submissions:', err);
      setError('Unable to load pending submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleApprove = async (submissionId: string) => {
    try {
      setProcessingId(submissionId);

      await updateDoc(doc(db, 'tree_submissions', submissionId), {
        status: 'approved',
        reviewedAt: serverTimestamp(),
        reviewedBy: 'admin',
        rejectionReason: '',
      });

      setSubmissions((current) =>
        current.filter((submission) => submission.id !== submissionId)
      );
    } catch (err) {
      console.error('Approval error:', err);
      setError('Unable to approve this submission.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (submissionId: string) => {
    const reason = window.prompt(
      'Enter the reason for rejecting this submission:'
    );

    if (reason === null) {
      return;
    }

    try {
      setProcessingId(submissionId);

      await updateDoc(doc(db, 'tree_submissions', submissionId), {
        status: 'rejected',
        reviewedAt: serverTimestamp(),
        reviewedBy: 'admin',
        rejectionReason: reason,
      });

      setSubmissions((current) =>
        current.filter((submission) => submission.id !== submissionId)
      );
    } catch (err) {
      console.error('Rejection error:', err);
      setError('Unable to reject this submission.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-leaf-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-leaf-900">
            Admin Verification
          </h1>

          <p className="mt-2 text-leaf-600">
            Review student tree planting submissions and verify their proof.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-leaf-600">
              Loading pending submissions...
            </p>
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-4 text-red-600">
            {error}
          </div>
        )}

        {!loading && submissions.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-leaf-500 mx-auto mb-3" />

            <h2 className="text-xl font-bold text-leaf-800">
              No Pending Submissions
            </h2>

            <p className="mt-2 text-leaf-600">
              There are currently no tree planting proofs waiting for review.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="overflow-hidden rounded-3xl bg-white border border-leaf-100 shadow-sm"
            >
              <div className="grid md:grid-cols-2">
                <div className="bg-leaf-100">
                  <img
                    src={submission.photoUrl}
                    alt={`Proof for ${submission.treeName}`}
                    className="w-full h-full min-h-72 object-cover"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <span className="rounded-full bg-sun-100 px-3 py-1 text-sm font-semibold text-sun-700">
                      ⏳ Pending
                    </span>
                  </div>

                  <h2 className="text-2xl font-extrabold text-leaf-900">
                    {submission.treeName}
                  </h2>

                  <div className="mt-5 space-y-4">
                    <div className="flex gap-3">
                      <User className="w-5 h-5 text-leaf-500" />

                      <div>
                        <p className="text-xs text-leaf-500">
                          Student
                        </p>

                        <p className="font-semibold text-leaf-800">
                          {submission.studentName}
                        </p>

                        <p className="text-sm text-leaf-600">
                          {submission.studentEmail}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <MapPin className="w-5 h-5 text-leaf-500" />

                      <div>
                        <p className="text-xs text-leaf-500">
                          Location
                        </p>

                        <p className="font-semibold text-leaf-800">
                          {submission.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Calendar className="w-5 h-5 text-leaf-500" />

                      <div>
                        <p className="text-xs text-leaf-500">
                          Planting Date
                        </p>

                        <p className="font-semibold text-leaf-800">
                          {submission.plantingDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleApprove(submission.id)}
                      disabled={processingId === submission.id}
                      className="flex items-center justify-center gap-2 rounded-xl bg-leaf-600 px-4 py-3 font-semibold text-white hover:bg-leaf-700 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-5 h-5" />

                      {processingId === submission.id
                        ? 'Processing...'
                        : 'Approve'}
                    </button>

                    <button
                      onClick={() => handleReject(submission.id)}
                      disabled={processingId === submission.id}
                      className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      <XCircle className="w-5 h-5" />

                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  }
