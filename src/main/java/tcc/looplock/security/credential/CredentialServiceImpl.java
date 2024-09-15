package tcc.looplock.security.credential;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CredentialServiceImpl implements CredentialService {

    private final CredentialRepository credentialRepository;

    @Override
    public List<Credential> listAll() {
        return credentialRepository.findAll();
    }

    @Override
    public Credential create(Credential credential) {
        if(credential.getId() != null){
            throw new RuntimeException("To create a record, you cannot have an ID");
        }

        return credentialRepository.save(credential);
    }

    @Override
    public Credential update(Credential credential) {
        if(credential.getId() == null){
            throw new RuntimeException("To update a record, you must have an ID");
        }

        return credentialRepository.save(credential);
    }

    @Override
    public void delete(Long id) {
        credentialRepository.deleteById(id);
    }
}
