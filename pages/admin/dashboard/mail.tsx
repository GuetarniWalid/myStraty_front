import AdminLayout from "@components/layouts/AdminLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement } from "react";

const Mail = () => {
    return (
        <div>
            Enter
        </div>
    );
}

Mail.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>
  }

  export async function getStaticProps({ locale }: { locale: string }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
      },
    }
  }

export default Mail;