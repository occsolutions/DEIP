
const secrets = [
  'mGowBDq', 'b7Q11jI', 'g85Fjiv', 'ycIyrtw', 'IL4UGkk', 'XPElWqn', 'GYWd5c0', 'Sqawuic', 'SfD8lKZ', '684gJLp', 'LPwTmq9', 'D7iRdut', 'BKwjMqj'
]
const charactersSecret = [
  { key: 'mGowBDq', value: 'pPFx1b8' },
  { key: 'b7Q11jI', value: 'otgQMWm' },
  { key: 'g85Fjiv', value: 'bNLPUxR' },
  { key: 'ycIyrtw', value: 'h91r0FQ' },
  { key: 'IL4UGkk', value: 'cmtmmz6' },
  { key: 'XPElWqn', value: 'cj5sGkZ' },
  { key: 'GYWd5c0', value: 'Pg7QCGp' },
  { key: 'Sqawuic', value: 'tUMgqso' },
  { key: 'SfD8lKZ', value: 'xjEgIiD' },
  { key: '684gJLp', value: '6MeUQ4Z' },
  { key: 'LPwTmq9', value: 'SQIjsXR' },
  { key: 'D7iRdut', value: 'VFLBzuj' },
  { key: 'BKwjMqj', value: 'IMjzG3w' }
]

const ACLSecretEncoding = (base64String: string): {bt: string; sec: string} => {
  const getSecret = (secrets: Array<string>): string => {
    const selectedSecret = Math.floor((Math.random() * 13) + 1)
    if (!secrets[selectedSecret]) {
      return getSecret(secrets)
    }
    return secrets[selectedSecret]
  }

  const selectedSecret = getSecret(secrets)
  return {
    bt: base64String.split('a').join((charactersSecret.find(secret => secret.key === selectedSecret) || { value: '' }).value),
    sec: selectedSecret
  }
}

const ACLSecretDecoding = (base64StringEncoded: string, secret: string): string => {
  const sec = charactersSecret.find(keyValue => keyValue.key === secret)
  return !sec ? '' : base64StringEncoded.split(sec.value).join('a')
}

export default {
  encoding (ACLConfig: any) {
    const base64String = btoa(JSON.stringify(ACLConfig))
    return ACLSecretEncoding(base64String)
  },
  decoding (base64StringEncoded: string, secret: string) {
    const aclStringBase64 = ACLSecretDecoding(base64StringEncoded, secret)
    try {
      const acl = atob(aclStringBase64)
      return JSON.parse(acl)
    } catch (e) {
      return {}
    }
  }
}
