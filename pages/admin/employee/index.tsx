import {
  Button,
  Dropdown,
  FormElement,
  Input,
  Pagination,
  Row,
  Table,
  Text,
} from '@nextui-org/react';
import axios from 'axios';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import Swal from 'sweetalert2';
import AdminLayout from '../../../components/common/AdminLayout';
import useAuth from '../../../libs/hooks/useAuth';
import useRoles from '../../../libs/hooks/useRoles';
import { useAdminUsers } from '../../../libs/swr/useAdminUsers';
import { UserType } from '../../../types';

const columns = [
  { name: 'Code', uid: 'id' },
  { name: 'Account', uid: 'username' },
  { name: 'Role', uid: 'role' },
  { name: 'Act', uid: 'actions' },
];

const IndexPage: NextPage = () => {
  useAuth(true);
  useRoles(['admin', '/admin/dashboard']);
  const [pageIndex, setPageIndex] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [temp, setTemp] = useState('');
  const router = useRouter();

  const handleEnter = async (e: React.KeyboardEvent<FormElement>) => {
    if (e.key === 'Enter') {
      setKeyword(temp);
    }
  };

  const handleChange = (e: React.ChangeEvent<FormElement>) =>
    setTemp(e.target.value);

  return (
    <>
      <Head>
        <title>Staff</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <AdminLayout title='Staff'>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Input
            onChange={handleChange}
            onKeyUp={handleEnter}
            aria-label='product-search'
            placeholder='Enter ID | Account'
            size='lg'
          />
          <Button
            shadow
            color='secondary'
            onClick={() => router.push('/admin/employee/add')}
          >
            More Staff
          </Button>
        </div>

        <div style={{ marginTop: 20 }}>
          <Page
            keyword={keyword}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
          />
          <div style={{ display: 'none' }}>
            <Page
              keyword={keyword}
              pageIndex={pageIndex + 1}
              setPageIndex={setPageIndex}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

const Page = ({
  keyword,
  pageIndex,
  setPageIndex,
}: {
  keyword: string;
  pageIndex: number;
  setPageIndex: Dispatch<SetStateAction<number>>;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    data: users,
    error,
    mutate,
  } = useAdminUsers(
    `?limit=20&page=${pageIndex}&name=${keyword}`,
    session?.accessToken
  );

  const handleChange = (page: number) => {
    setPageIndex(page);
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Erase!',
      cancelButtonText: 'Close',
      preConfirm: async (login) => {
        try {
          const res = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/user/${id}`,
            {
              headers: {
                Authorization: `Bearer ${session?.accessToken}`,
              },
            }
          );
          return res;
        } catch (error: any) {
          Swal.showValidationMessage(`Delete failure`);
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value?.status == 200) {
        Swal.fire({
          title: 'Deleted successfully!',
          icon: 'success',
        });
        const res: any = await mutate();
        if (res.meta.itemCount === 0 && pageIndex > 1) {
          setPageIndex(pageIndex - 1);
        }
      }
    });
  };

  const renderCell = (user: UserType, columnKey: React.Key) => {
    switch (columnKey) {
      case 'id':
        return (
          <Text b size={13} css={{ color: '$accents7' }}>
            {user.id}
          </Text>
        );

      case 'username':
        return (
          <Text b size={13} css={{ color: '$accents7' }}>
            {user.username}
          </Text>
        );

      case 'role':
        return (
          <Text b size={13} css={{ color: '$accents7' }}>
            {user.roles[0]}
          </Text>
        );

      default:
        return (
          <Row justify='center' align='center'>
            <Dropdown placement='bottom-right'>
              <Dropdown.Button
                ripple={false}
                css={{
                  background: '$gray100',
                  color: '$gray800',
                  '&:hover': {
                    background: '$gray200',
                  },
                  '&:active': {
                    background: '$gray300',
                  },
                  '&:focus': {
                    borderColor: '$gray400',
                  },
                }}
                flat
              ></Dropdown.Button>
              <Dropdown.Menu aria-label='Static Actions'>
                <Dropdown.Item key='edit' textValue='Detail'>
                  <Text
                    color='inherit'
                    onClick={() =>
                      router.push(`/admin/employee/update/${user.id}`)
                    }
                  >
                    Detail
                  </Text>
                </Dropdown.Item>
                <Dropdown.Item key='delete' color='error' textValue='Cancel'>
                  <Text color='inherit' onClick={() => handleDelete(user.id)}>
                    Erase
                  </Text>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Row>
        );
    }
  };

  return (
    <>
      <Table
        aria-label='Employee table'
        // css={{
        //   height: 'auto',
        // }}
        color='secondary'
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column key={column.uid}>{column.name}</Table.Column>
          )}
        </Table.Header>
        <Table.Body items={users?.items || []}>
          {(item: UserType) => (
            <Table.Row>
              {(columnKey) => (
                <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      {users && (
        <Row justify='center' css={{ marginTop: 20, marginBottom: 20 }}>
          <Pagination
            shadow
            color='secondary'
            total={users?.meta.totalPages}
            onChange={(page) => handleChange(page)}
            page={pageIndex}
          />
        </Row>
      )}
    </>
  );
};

export default IndexPage;
