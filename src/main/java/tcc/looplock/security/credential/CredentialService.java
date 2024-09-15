package tcc.looplock.security.credential;

import java.util.List;

public interface CredentialService {
    List<Credential> listAll();
    Credential create(Credential credential);
    Credential update(Credential credential);
    void delete(Long id);
}
