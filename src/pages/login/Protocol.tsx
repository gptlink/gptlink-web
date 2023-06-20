import { useEffect, useState } from 'react';
import AppServices, { ConfigAgreementType } from '@/api/app';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function PrivacyProtocol() {
  const [protocol, setProtocol] = useState<ConfigAgreementType>({ title: '', agreement: '' });

  useEffect(() => {
    AppServices.getConfigAgreement().then((res) => {
      setProtocol(res);
    });
  }, []);

  return (
    <Dialog>
      <DialogTrigger>
        <span className="text-blue-600">《{protocol.title}》</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{protocol.title}</DialogTitle>
          <DialogDescription
            className="h-96 overflow-auto"
            dangerouslySetInnerHTML={{ __html: protocol.agreement }}
          ></DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
