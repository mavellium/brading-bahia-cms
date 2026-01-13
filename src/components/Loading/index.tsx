/* eslint-disable @typescript-eslint/no-explicit-any */
import { ManageLayout } from "../Manage/ManageLayout";

export default function Loading({ layout, exists }: { layout: any; exists: boolean}){
    return(
      <ManageLayout
        headerIcon={layout}
        title="Personalização do Footer"
        description="Configure o tema, cores e conteúdo do rodapé do site"
        exists={exists}
        itemName="Footer Theme"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-zinc-400">Carregando configurações...</p>
          </div>
        </div>
      </ManageLayout>
    )
}