import { Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Feedback';
import { CvStatus } from '@jobhunter/types';
import { useListCvsQuery, useActivateCvMutation, useDeleteCvMutation, useUploadCvMutation } from '@/store/api/candidateApi';
import { formatDate } from '@/lib/utils';

export default function CvVersionsScreen() {
  const { data, isLoading } = useListCvsQuery();
  const [activate, { isLoading: activating }] = useActivateCvMutation();
  const [del, { isLoading: deleting }] = useDeleteCvMutation();
  const [upload, { isLoading: uploading }] = useUploadCvMutation();

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: 'CV Versions' }} />
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-sm text-gray-500">PDF/DOCX/TXT · ≤10MB · ClamAV scanned</Text>
        <Button label="Upload CV" size="sm" loading={uploading} onPress={() => upload({ filename: `CV_${Date.now()}.pdf`, size_bytes: 230000 })} />
      </View>
      {isLoading || !data ? (
        <Loader />
      ) : (
        <View className="gap-3">
          {data.map((cv) => (
            <Card key={cv.id}>
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-2">
                  <Text className="text-base font-semibold text-gray-900">{cv.filename}</Text>
                  <Text className="text-xs text-gray-400">Uploaded {formatDate(cv.created_at)} · {(cv.size_bytes / 1024).toFixed(0)} KB</Text>
                </View>
                <View className="items-end gap-1">
                  {cv.status === CvStatus.ACTIVE ? <Badge label="ACTIVE" tone="success" /> : cv.status === CvStatus.PARSING ? <Badge label="PARSING…" tone="warning" /> : <Badge label="Inactive" tone="gray" />}
                  {cv.rebuild_source === 'AI' ? <Badge label="AI-generated" tone="brand" /> : null}
                </View>
              </View>
              {cv.ats_score !== undefined ? <Text className="mt-2 text-sm text-gray-600">ATS score: <Text className="font-bold text-navy-900">{cv.ats_score}</Text></Text> : null}
              <View className="mt-3 flex-row gap-2">
                {cv.status !== CvStatus.ACTIVE ? (
                  <Button label={cv.rebuild_source === 'AI' ? 'Approve & activate' : 'Set active'} size="sm" loading={activating} onPress={() => activate(cv.id)} />
                ) : null}
                <Button label="Preview" size="sm" variant="outline" onPress={() => {}} />
                {cv.status !== CvStatus.ACTIVE ? <Button label="Delete" size="sm" variant="ghost" loading={deleting} onPress={() => del(cv.id)} /> : null}
              </View>
            </Card>
          ))}
        </View>
      )}
    </Screen>
  );
}
