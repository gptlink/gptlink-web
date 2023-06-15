import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, PlusCircle, Edit2Icon, Trash2, X, Check } from 'lucide-react';

import chatService, { RoleType } from '@/api/chat';
import { useChatStore } from '@/store';
import SvgIcon from '@/components/SvgIcon';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { RoleListDialog } from './RoleListDialog';

const ConversationList = () => {
  const { t } = useTranslation();
  const [
    conversationList,
    currentConversation,
    addConversation,
    switchConversation,
    delConversation,
    editConversation,
  ] = useChatStore((state) => [
    state.conversationList,
    state.currentConversation,
    state.addConversation,
    state.switchConversation,
    state.delConversation,
    state.editConversation,
  ]);

  const [editTitle, setEditTitle] = useState('');
  const [inEditId, setInEditId] = useState('');

  const handleEditConversation = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setInEditId('');
    setEditTitle('');
    editConversation(inEditId, { title: editTitle });
    e.stopPropagation();
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Button variant={'outline'} className="m-4 shrink-0 border-dashed leading-8" onClick={() => addConversation()}>
        <PlusCircle size={16} className="mr-2" /> {t('new conversation')}
      </Button>

      <ScrollArea>
        <div className="flex w-64 flex-1 flex-col gap-4 overflow-auto px-4">
          {conversationList.map((item, index) => (
            <Button
              variant={currentConversation.uuid === item.uuid ? 'default' : 'outline'}
              className="flex justify-start gap-2 px-3"
              key={index}
              title={item.title}
              onClick={() => switchConversation(item.uuid)}
            >
              {item.icon ? (
                <SvgIcon className="shrink-0" icon={item.icon} />
              ) : (
                <MessageSquare className="shrink-0" size={14}></MessageSquare>
              )}
              {inEditId === item.uuid ? (
                <>
                  <input
                    value={editTitle}
                    autoFocus
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 overflow-hidden rounded-sm px-2 text-secondary-foreground outline-none"
                  />
                  <X
                    className="shrink-0"
                    size={14}
                    onClick={() => {
                      setInEditId('');
                      setEditTitle('');
                    }}
                  />
                  <Check className="shrink-0" size={14} onClick={handleEditConversation} />
                </>
              ) : (
                <>
                  <p className="flex-1 truncate text-left">{item.title}</p>
                  <Edit2Icon
                    size={14}
                    onClick={(e) => {
                      setInEditId(item.uuid);
                      setEditTitle(item.title);
                      e.stopPropagation();
                    }}
                  />
                  <Trash2
                    size={14}
                    onClick={(e) => {
                      if (confirm('确定删除该对话吗？')) {
                        delConversation(item.uuid);
                        e.stopPropagation();
                      }
                    }}
                  />
                </>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

const RoleList = ({ data }: { data: RoleType[] }) => {
  const { t } = useTranslation();
  const [addConversation] = useChatStore((state) => [state.addConversation]);

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center leading-8">—— {t('role')} ——</div>
      <div className="grid h-44 grid-cols-2 gap-2 px-4">
        {data.slice(0, 8).map((item, index) => (
          <Button
            variant={'outline'}
            className="flex	h-fit items-center justify-start gap-1 px-2"
            key={index}
            onClick={() => addConversation(item.name, item.icon, item.prompt, item.id)}
          >
            <SvgIcon icon={item.icon} className="shrink-0" />
            <span className="truncate" title={item.name}>
              {item.name}
            </span>
          </Button>
        ))}
      </div>
      <RoleListDialog data={data} roleSelect={(item) => addConversation(item.name, item.icon, item.prompt, item.id)}>
        <Button variant={'secondary'} className="m-2">
          全部角色
        </Button>
      </RoleListDialog>
    </div>
  );
};

const Conversation = () => {
  const [roleList, setRoleList] = useState<RoleType[]>([]);

  useEffect(() => {
    const getRoleList = async () => {
      const res = await chatService.getRoleList();
      setRoleList(res);
    };
    getRoleList();
  }, []);

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-4 overflow-hidden border-r text-xs">
      <ConversationList />
      <RoleList data={roleList} />
    </aside>
  );
};

export default Conversation;
