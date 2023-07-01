import { useEffect, useState } from 'react';
import AppServices, { ConfigAgreementType } from '@/api/app';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';

export function PrivacyProtocol() {
  const [protocol, setProtocol] = useState<ConfigAgreementType>({ title: '', agreement: '' });

  useEffect(() => {
    AppServices.getConfigAgreement().then((res) => {
      setProtocol(res);
    });
  }, []);

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <span className="text-blue-600">《{protocol.title}》</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{protocol.title}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription
          className="h-96 overflow-auto"
          dangerouslySetInnerHTML={{ __html: protocol.agreement }}
        ></AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction>确认</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
