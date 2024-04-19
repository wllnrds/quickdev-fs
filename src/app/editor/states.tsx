import useSWR from "swr"

export function PostStates({ post_id } : { post_id : string }){
    const { data, error } = useSWR(['post','extra', post_id], loadState)
    
    async function loadState(){
        const extra = await fetch(
            `/api/post/${ post_id }/state`
        ).then( async (result) => {
            return await result.json()
        }).catch( err => [] )

        return extra.data
    }
    
    if( data ){
        return <>
            <div className="flex flex-row gap-4">
                <table width={ "100%" }>
                    <tbody>
                        <tr><td colSpan={2} className="font-bold"><span>Informações</span></td></tr>
                        <tr><td>Alterações</td><td>{ data?.changes || 0 }</td></tr>
                        <tr><td width={ "50%" }>Visitas</td><td>{ data?.visits || 0 }</td></tr>
                        <tr><td>Comentários</td><td>{ data?.comments || 0 }</td></tr>
                        <tr><td colSpan={2}>&nbsp;</td></tr>
                        <tr><td colSpan={2} className="font-bold"><span>Interações</span></td></tr>
                        <tr><td>Gostei</td><td>{ data?.likes || 0 }</td></tr>
                        <tr><td>Não gostei</td><td>{ data?.dislikes || 0 }</td></tr>
                    </tbody>
                </table>
            </div>
            <hr />
        </>
    }

    return <></>

}