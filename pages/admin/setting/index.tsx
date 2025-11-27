import type { NextPage } from 'next';
import Head from 'next/head';
import AdminLayout from '../../../components/common/AdminLayout';
import useAuth from '../../../libs/hooks/useAuth';

const IndexPage: NextPage = () => {
  useAuth(true);
  return (
    <>
      <Head>
        <title>Setting</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <AdminLayout title='Setting'>
      </AdminLayout>
    </>
  );
};

export default IndexPage;
