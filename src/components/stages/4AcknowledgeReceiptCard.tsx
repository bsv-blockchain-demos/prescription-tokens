import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { cardMediaSx, cardContainerSx, cardTitleSx, cardDescriptionSx, disabledCardSx } from '../styles/CardStyles';
import { Token } from '../types';
import { Transaction, PushDrop, Utils, WalletInterface, Script, OP } from '@bsv/sdk';
import { patient, pharmacyIdentityKey } from '../../utils/wallets';
import { saveSubmission, setSpent } from '../../utils/db';
import { useBroadcast } from '../../context/broadcast';
import { useLanguage } from '../../context/language';

const AcknowledgeReceiptCard: React.FC = () => {
  const { addToQueue, dispensation, setDispensation, setAcknowledgement, setIsSubmitting, isSubmitting } = useBroadcast()
  const { t } = useLanguage()

    async function patientAcknowledgesReceipt() {
        try {
          if (isSubmitting) return
          const sourceTransaction = Transaction.fromBEEF(dispensation!.tx)
          setIsSubmitting(true)
          const pushdrop = new PushDrop(patient as WalletInterface, 'https://prescription-tokens.vercel.app')
          const id = dispensation!.data.id
          const arId = Utils.toArray(id, 'base64')
          
          const tx = new Transaction()
    
          const unlockingScriptTemplate = pushdrop.unlock(
            [0, 'medical prescription'],
            id,
            pharmacyIdentityKey,
            'all', 
            false
          )
          tx.addInput({
            sourceTransaction,
            sourceOutputIndex: 0,
            unlockingScriptTemplate
          })
    
          const timestamp = new Date().toISOString()
          
          const lockingScript = new Script()
          lockingScript.writeOpCode(OP.OP_FALSE)
          lockingScript.writeOpCode(OP.OP_RETURN)
          lockingScript.writeBin(Utils.toArray(t.dataStatus.acknowledged, 'utf8'))
          lockingScript.writeBin(arId)

          tx.addOutput({
            lockingScript,
            satoshis: 0
          })
    
          await tx.sign()
    
          const token: Token = {
            data: {
              id,
              timestamp,
              status: t.dataStatus.acknowledged,
            },
            txid: tx.id('hex'),
            tx: tx.toBEEF(),
            status: 'acknowledged',
            spent: true
          }
    
          setDispensation(null)
          setAcknowledgement(token)
          addToQueue(token)
    
          await setSpent(dispensation!.txid)
          await saveSubmission(token)

          console.log({ tx: tx.toHexBEEF() })

        } catch (error) {
          console.error('Error creating prescription:', error)
        } finally {
          setIsSubmitting(false)
        }
      }

    
    const cardSx = !dispensation ? disabledCardSx : cardContainerSx

  return (
    <Card sx={cardSx}>
      <CardActionArea disabled={!dispensation} onClick={patientAcknowledgesReceipt}>
        <CardMedia
          component="img"
          image="/acknowledge.png"
          alt="Acknowledge Receipt"
          sx={cardMediaSx}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" sx={{
            ...cardTitleSx,
            color: '#2c6e8e'
          }}>
            {t.stages.acknowledge.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={cardDescriptionSx}>
            {t.stages.acknowledge.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default AcknowledgeReceiptCard;
