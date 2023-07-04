import { useEffect, useState } from 'react';
import AppServices, { ConfigAgreementType } from '@/api/app';
import { Checkbox } from '@/components/ui/checkbox';

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

export function PrivacyProtocol({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
}) {
  const [protocol, setProtocol] = useState<ConfigAgreementType>({ title: '', agreement: '', enable: false });

  useEffect(() => {
    AppServices.getConfigAgreement().then((res) => {
      setProtocol(res);
      if (!res.enable) onCheckedChange(true);
    });
  }, []);

  if (!protocol.enable) return <></>;

  return (
    <>
      <Checkbox className="mr-2" checked={checked} onCheckedChange={onCheckedChange} />
      我已阅读并同意
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
    </>
  );
}
